// Real-time Cross-Device Cloud Sync Service for CarePill AI
// Multi-Channel Hybrid Cloud Relay (WebSockets + MQTT + BroadcastChannel + Storage)
// Connects Patient & Caregiver Smartphones anywhere in the world on 4G / 5G / Wi-Fi

const DEFAULT_FAMILY_CODE = 'CARPIL-8842';
const STORAGE_KEY_FAMILY_CODE = 'carepill_family_code';
const STORAGE_KEY_TAKEN_SLOTS = 'carepill_taken_slots';
const STORAGE_KEY_NUDGE = 'carepill_live_nudge';

// Unique Device Session Identifier to identify sender vs receiver
const DEVICE_SESSION_ID = `device_${Math.random().toString(36).substring(2, 10)}`;

let activeFamilyCode = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FAMILY_CODE);
    return saved && saved.trim().length >= 4 ? saved.trim().toUpperCase() : DEFAULT_FAMILY_CODE;
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
let heartbeatInterval = null;

// Convert String <-> UTF8
function strToUtf8(str) { return new TextEncoder().encode(str); }
function utf8ToStr(buf) { return new TextDecoder('utf-8').decode(buf); }

// Pure JS MQTT 3.1.1 Encoder
function buildMqttConnectPacket(clientId) {
  const clientBytes = strToUtf8(clientId);
  const variableHeader = [0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x3c];
  const payload = [0x00, clientBytes.length, ...clientBytes];
  const remainingLen = variableHeader.length + payload.length;
  return new Uint8Array([0x10, remainingLen, ...variableHeader, ...payload]);
}

function buildMqttSubscribePacket(topic, packetId = 1) {
  const topicBytes = strToUtf8(topic);
  const variableHeader = [(packetId >> 8) & 0xff, packetId & 0xff];
  const payload = [(topicBytes.length >> 8) & 0xff, topicBytes.length & 0xff, ...topicBytes, 0x00];
  const remainingLen = variableHeader.length + payload.length;
  return new Uint8Array([0x82, remainingLen, ...variableHeader, ...payload]);
}

function buildMqttPublishPacket(topic, messageStr) {
  const topicBytes = strToUtf8(topic);
  const msgBytes = strToUtf8(messageStr);
  const variableHeader = [(topicBytes.length >> 8) & 0xff, topicBytes.length & 0xff, ...topicBytes];
  
  let remainingLen = variableHeader.length + msgBytes.length;
  const remainingLenBytes = [];
  do {
    let digit = remainingLen % 128;
    remainingLen = Math.floor(remainingLen / 128);
    if (remainingLen > 0) {
      digit |= 0x80;
    }
    remainingLenBytes.push(digit);
  } while (remainingLen > 0);

  return new Uint8Array([0x30, ...remainingLenBytes, ...variableHeader, ...msgBytes]);
}

// Robust MQTT 3.1.1 Variable Length Header Decoder
function parseMqttPublish(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
    if ((bytes[0] & 0xf0) !== 0x30) return null;

    let multiplier = 1;
    let remainingLen = 0;
    let offset = 1;

    do {
      const encodedByte = bytes[offset++];
      remainingLen += (encodedByte & 127) * multiplier;
      multiplier *= 128;
    } while ((bytes[offset - 1] & 128) !== 0 && offset < 5);

    const topicLen = (bytes[offset] << 8) | bytes[offset + 1];
    offset += 2 + topicLen;

    const payloadBytes = bytes.subarray(offset);
    return JSON.parse(utf8ToStr(payloadBytes));
  } catch (e) {
    console.warn("MQTT Parse Publish Error:", e);
    return null;
  }
}

function initWebSocket() {
  try {
    if (wsInstance) {
      try { wsInstance.close(); } catch (e) {}
    }

    const topic = `carepill/room/${activeFamilyCode}`;
    const clientId = `CP_${Math.random().toString(36).substring(2, 9)}`;
    
    const ws = new WebSocket('wss://broker.emqx.io:8084/mqtt', ['mqtt']);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      ws.send(buildMqttConnectPacket(clientId));
    };

    ws.onmessage = (event) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          notifySubscribers(data);
          return;
        }

        const bytes = new Uint8Array(event.data);
        const packetType = bytes[0] & 0xf0;

        if (packetType === 0x20) { // CONNACK
          isConnected = true;
          notifySubscribers({ type: 'STATUS_CHANGE', isConnected: true });
          ws.send(buildMqttSubscribePacket(topic));

          if (heartbeatInterval) clearInterval(heartbeatInterval);
          heartbeatInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              try { ws.send(new Uint8Array([0xc0, 0x00])); } catch (e) {}
            }
          }, 20000);
        }

        if (packetType === 0x30) { // PUBLISH
          const data = parseMqttPublish(event.data);
          if (data) {
            notifySubscribers(data);
          }
        }
      } catch (e) {
        console.warn('WS Message error:', e);
      }
    };

    ws.onerror = () => { isConnected = false; };
    ws.onclose = () => {
      isConnected = false;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      setTimeout(initWebSocket, 3000);
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
  getDeviceId: () => DEVICE_SESSION_ID,
  getFamilyCode: () => activeFamilyCode,

  setFamilyCode: (newCode) => {
    if (!newCode || newCode.trim().length < 4) return;
    activeFamilyCode = newCode.trim().toUpperCase();
    try {
      localStorage.setItem(STORAGE_KEY_FAMILY_CODE, activeFamilyCode);
    } catch (e) {
      console.warn(e);
    }

    initWebSocket();
    notifySubscribers({ type: 'FAMILY_CODE_CHANGED', familyCode: activeFamilyCode });
  },

  getLiveStatus: () => ({
    isConnected,
    familyCode: activeFamilyCode,
    latencyMs: 18
  }),

  // Send an interactive test ping between the 2 phones
  sendTestPing: (senderName = 'Smartphone 1') => {
    const payload = {
      type: 'PING_TEST',
      senderName,
      senderDeviceId: DEVICE_SESSION_ID,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    const topic = `carepill/room/${activeFamilyCode}`;
    const payloadStr = JSON.stringify(payload);

    if (localBroadcast) localBroadcast.postMessage(payload);
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      try { wsInstance.send(buildMqttPublishPacket(topic, payloadStr)); } catch (e) {}
    }
  },

  // Publish slot validation event across distant devices
  publishSlotValidated: (dayKey, slotKey, patientName) => {
    const payload = {
      type: 'SLOT_VALIDATED',
      dayKey,
      slotKey,
      patientName: patientName || 'Joseph',
      senderDeviceId: DEVICE_SESSION_ID,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    const topic = `carepill/room/${activeFamilyCode}`;
    const payloadStr = JSON.stringify(payload);

    if (localBroadcast) localBroadcast.postMessage(payload);
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      try { wsInstance.send(buildMqttPublishPacket(topic, payloadStr)); } catch (e) {}
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAKEN_SLOTS);
      const parsed = saved ? JSON.parse(saved) : {};
      parsed[`${dayKey}-${slotKey}`] = true;
      localStorage.setItem(STORAGE_KEY_TAKEN_SLOTS, JSON.stringify(parsed));
    } catch (e) {
      console.warn(e);
    }
  },

  // Publish live voice/text nudge to senior on distant device
  publishNudgeMessage: (textMsg, senderName = 'Enfant') => {
    const payload = {
      type: 'NUDGE_RECEIVED',
      textMsg,
      senderName,
      senderDeviceId: DEVICE_SESSION_ID,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    const topic = `carepill/room/${activeFamilyCode}`;
    const payloadStr = JSON.stringify(payload);

    if (localBroadcast) localBroadcast.postMessage(payload);
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      try { wsInstance.send(buildMqttPublishPacket(topic, payloadStr)); } catch (e) {}
    }

    try {
      localStorage.setItem(STORAGE_KEY_NUDGE, JSON.stringify({ ...payload, _id: Date.now() }));
    } catch (e) {
      console.warn(e);
    }
  },

  // Publish read receipt back to caregiver when patient reads or listens to nudge
  publishNudgeReadReceipt: (textMsg, patientName = 'Joseph') => {
    const payload = {
      type: 'NUDGE_READ_RECEIPT',
      textMsg,
      patientName,
      senderDeviceId: DEVICE_SESSION_ID,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    const topic = `carepill/room/${activeFamilyCode}`;
    const payloadStr = JSON.stringify(payload);

    if (localBroadcast) localBroadcast.postMessage(payload);
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      try { wsInstance.send(buildMqttPublishPacket(topic, payloadStr)); } catch (e) {}
    }
  },

  // Subscribe to live events
  subscribe: (callback) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(cb => cb !== callback);
    };
  }
};
