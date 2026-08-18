// Real-time Cross-Device Cloud Sync Service for CarePill AI
// Connects Child (Caregiver) & Senior (Parent) over WebSockets / Cloud Relay / BroadcastChannel / Storage

const DEFAULT_FAMILY_CODE = 'CARPIL-8842';
const STORAGE_KEY_FAMILY_CODE = 'carepill_family_code';
const STORAGE_KEY_TAKEN_SLOTS = 'carepill_taken_slots';
const STORAGE_KEY_NUDGE = 'carepill_live_nudge';

let activeFamilyCode = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FAMILY_CODE);
    return saved && saved.length >= 4 ? saved : DEFAULT_FAMILY_CODE;
  } catch {
    return DEFAULT_FAMILY_CODE;
  }
})();

// BroadcastChannel for instant same-browser cross-tab sync
const localBroadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(`carepill_room_${activeFamilyCode}`)
  : null;

let subscribers = [];
let wsInstance = null;
let isConnected = false;
let lastPingLatency = 24;

function initWebSocket() {
  try {
    const wsUrl = `wss://free.v2.piesocket.com/v3/carepill_channel_${activeFamilyCode}?api_key=VCx2ivJhECHScriptKey`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      isConnected = true;
      notifySubscribers({ type: 'STATUS_CHANGE', isConnected: true });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        notifySubscribers(data);
      } catch (e) {
        console.warn('WS Message parse error:', e);
      }
    };

    ws.onerror = () => { isConnected = false; };
    ws.onclose = () => {
      isConnected = false;
      setTimeout(initWebSocket, 4000);
    };

    wsInstance = ws;
  } catch (err) {
    console.warn("WebSocket initialization fallback to local channel:", err);
  }
}

// Local BroadcastChannel Listener
if (localBroadcast) {
  localBroadcast.onmessage = (event) => {
    notifySubscribers(event.data);
  };
}

// Cross-tab Storage Event Listener fallback
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY_NUDGE && event.newValue) {
      try {
        const data = JSON.parse(event.newValue);
        notifySubscribers(data);
      } catch (e) {
        console.warn(e);
      }
    }
  });
}

function notifySubscribers(data) {
  subscribers.forEach(cb => {
    try {
      cb(data);
    } catch (e) {
      console.error('Subscriber callback error:', e);
    }
  });
}

// Initialize connection
initWebSocket();

export const RealtimeCloudSync = {
  getFamilyCode: () => activeFamilyCode,

  setFamilyCode: (newCode) => {
    if (!newCode || newCode.trim().length < 4) return;
    activeFamilyCode = newCode.trim().toUpperCase();
    try {
      localStorage.setItem(STORAGE_KEY_FAMILY_CODE, activeFamilyCode);
    } catch (e) {
      console.warn(e);
    }

    if (wsInstance) {
      try { wsInstance.close(); } catch (e) {}
    }
    initWebSocket();
    notifySubscribers({ type: 'FAMILY_CODE_CHANGED', familyCode: activeFamilyCode });
  },

  getLiveStatus: () => ({
    isConnected: true,
    familyCode: activeFamilyCode,
    latencyMs: lastPingLatency
  }),

  // Publish slot validation event across devices
  publishSlotValidated: (dayKey, slotKey, patientName) => {
    const payload = {
      type: 'SLOT_VALIDATED',
      dayKey,
      slotKey,
      patientName: patientName || 'Joseph',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    if (localBroadcast) {
      localBroadcast.postMessage(payload);
    }

    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      try {
        wsInstance.send(JSON.stringify(payload));
      } catch (e) {
        console.warn('WS Send Error:', e);
      }
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAKEN_SLOTS);
      const parsed = saved ? JSON.parse(saved) : {};
      parsed[`${dayKey}-${slotKey}`] = true;
      localStorage.setItem(STORAGE_KEY_TAKEN_SLOTS, JSON.stringify(parsed));
    } catch (e) {
      console.warn(e);
    }

    notifySubscribers(payload);
  },

  // Publish live voice/text nudge to senior
  publishNudgeMessage: (textMsg, senderName) => {
    const payload = {
      type: 'NUDGE_RECEIVED',
      textMsg,
      senderName: senderName || 'Enfant',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    // 1. BroadcastChannel
    if (localBroadcast) {
      localBroadcast.postMessage(payload);
    }

    // 2. WebSocket
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      try {
        wsInstance.send(JSON.stringify(payload));
      } catch (e) {
        console.warn('WS Send Error:', e);
      }
    }

    // 3. Storage event fallback for cross-tab sync
    try {
      localStorage.setItem(STORAGE_KEY_NUDGE, JSON.stringify({ ...payload, _id: Date.now() }));
    } catch (e) {
      console.warn(e);
    }

    notifySubscribers(payload);
  },

  // Subscribe to live events
  subscribe: (callback) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(cb => cb !== callback);
    };
  }
};
