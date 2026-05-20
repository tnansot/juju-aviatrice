// bc-identite — hook gestion device ID (ADR-005)
const STORAGE_KEY = "device-id";

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(STORAGE_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  return deviceId;
}

export function useDeviceId(): string {
  return getDeviceId();
}
