import axios from 'axios';

// n8n webhook endpoint configuration
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/allerguard-log';

export interface ScanPayload {
  timestamp: string;
  verdict: 'SAFE' | 'WARNING' | 'CRITICAL';
  extractedText: string;
  matchedAllergens: string[];
  prideLoopTriggered: boolean;
  metadata: {
    deviceId: string;
    clientVersion: string;
  };
}

export const apiService = {
  logScan: async (payload: ScanPayload): Promise<void> => {
    try {
      // Dispatch payload to n8n Webhook Node
      console.log("Dispatching to n8n webhook:", payload);
      await axios.post(N8N_WEBHOOK_URL, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error("Failed to log scan to n8n:", error);
      // Failsafe: Continue app execution even if logging fails
    }
  }
};

// Generate a pseudo-anonymous device ID for k-anonymity compliance
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('allerguard_device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('allerguard_device_id', deviceId);
  }
  return deviceId;
};
