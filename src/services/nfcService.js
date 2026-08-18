// Real Web NFC (NDEFReader) Reader & Writer Service for Physical Pillbox Stickers

export const NfcService = {
  isSupported: () => typeof window !== 'undefined' && 'NDEFReader' in window,

  // Write NDEF Tag record to physical NFC sticker (e.g. NTAG213 / NTAG215 on pillbox slot)
  writeSlotTag: async (slotKey) => {
    if (!NfcService.isSupported()) {
      throw new Error("L'API Web NFC n'est pas disponible sur cet appareil. Utilisez un navigateur Android Chrome compatible Web NFC.");
    }

    try {
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: "text",
            data: JSON.stringify({
              app: "CarePillAI",
              slot: slotKey,
              timestamp: Date.now()
            })
          }
        ]
      });
      return { success: true, slotKey };
    } catch (err) {
      throw new Error(`Échec de l'écriture NFC: ${err.message}`);
    }
  },

  // Listen to physical NFC tag scan
  startScan: async (onTagDiscovered, onError) => {
    if (!NfcService.isSupported()) {
      onError("L'API Web NFC n'est pas disponible sur cet appareil.");
      return () => {};
    }

    try {
      const ndef = new window.NDEFReader();
      await ndef.scan();

      const handleReading = ({ message, serialNumber }) => {
        let slotKey = 'Matin';
        for (const record of message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder();
            try {
              const parsed = JSON.parse(textDecoder.decode(record.data));
              if (parsed.slot) slotKey = parsed.slot;
            } catch {
              // Plain text fallback
            }
          }
        }

        onTagDiscovered({ serialNumber, slotKey });
      };

      const handleReadingError = (error) => {
        onError("Erreur de lecture NFC: " + error.message);
      };

      ndef.addEventListener("reading", handleReading);
      ndef.addEventListener("readingerror", handleReadingError);

      return () => {
        try {
          ndef.removeEventListener("reading", handleReading);
          ndef.removeEventListener("readingerror", handleReadingError);
        } catch (e) {
          console.warn(e);
        }
      };
    } catch (err) {
      onError("Impossible d'activer le récepteur NFC: " + err.message);
      return () => {};
    }
  }
};
