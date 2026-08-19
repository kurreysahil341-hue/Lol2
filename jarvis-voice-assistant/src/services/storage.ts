import { Preferences } from '@capacitor/preferences';

// Cross-platform key/value: uses Capacitor Preferences on device, localStorage on web dev
export const StorageService = {
  async get(key: string): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ?? null;
    } catch {
      return localStorage.getItem(key);
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({ key, value });
    } catch {
      localStorage.setItem(key, value);
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch {
      localStorage.removeItem(key);
    }
  }
};
