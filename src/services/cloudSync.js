// CarePill Cloud & Local Persistence Sync Service

const STORAGE_KEY_TAKEN_SLOTS = 'carepill_taken_slots';
const STORAGE_KEY_SYMPTOMS = 'carepill_symptoms_log';
const STORAGE_KEY_NOTICES = 'carepill_live_notifications';

// BroadcastChannel for cross-tab / cross-device live sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('carepill_live_sync')
  : null;

export const CloudSyncService = {
  // Load saved state or default
  getTakenSlots: (defaultSlots) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAKEN_SLOTS);
      return saved ? JSON.parse(saved) : defaultSlots;
    } catch {
      return defaultSlots;
    }
  },

  saveTakenSlots: (slots) => {
    try {
      localStorage.setItem(STORAGE_KEY_TAKEN_SLOTS, JSON.stringify(slots));
      if (syncChannel) {
        syncChannel.postMessage({ type: 'TAKEN_SLOTS_UPDATED', payload: slots });
      }
    } catch (e) {
      console.error('CloudSync Save Error:', e);
    }
  },

  // Subscribe to real-time events across windows/devices
  subscribeToUpdates: (onSlotsUpdated, onNoticeReceived) => {
    if (!syncChannel) return () => {};

    const handleMessage = (event) => {
      if (event.data?.type === 'TAKEN_SLOTS_UPDATED') {
        onSlotsUpdated(event.data.payload);
      }
      if (event.data?.type === 'NOTICE_SENT' && onNoticeReceived) {
        onNoticeReceived(event.data.payload);
      }
    };

    syncChannel.addEventListener('message', handleMessage);
    return () => syncChannel.removeEventListener('message', handleMessage);
  },

  sendNotice: (msgText) => {
    if (syncChannel) {
      syncChannel.postMessage({ type: 'NOTICE_SENT', payload: msgText });
    }
  }
};
