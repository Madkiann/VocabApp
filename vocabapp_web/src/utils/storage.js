import { Preferences } from '@capacitor/preferences';

// A synchronous memory cache for fast React initializations
const storageCache = new Map();

export const initStorage = async () => {
    try {
        const { keys } = await Preferences.keys();
        for (const key of keys) {
            const { value } = await Preferences.get({ key });
            if (value !== null) {
                storageCache.set(key, value);
            }
        }
        console.log("Storage loaded successfully into memory cache.", keys.length, "keys.");
    } catch (e) {
        console.error("Failed to initialize storage", e);
    }
};

export const syncStorage = {
    getItem: (key) => {
        return storageCache.has(key) ? storageCache.get(key) : null;
    },
    setItem: (key, value) => {
        const stringValue = typeof value === 'string' ? value : String(value);
        storageCache.set(key, stringValue);
        Preferences.set({ key, value: stringValue }).catch(e => console.error(`Storage set failed for ${key}`, e));
    },
    removeItem: (key) => {
        storageCache.delete(key);
        Preferences.remove({ key }).catch(e => console.error(`Storage remove failed for ${key}`, e));
    },
    clear: () => {
        storageCache.clear();
        Preferences.clear().catch(e => console.error("Storage clear failed", e));
    }
};
