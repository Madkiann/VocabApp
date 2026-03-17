import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

/**
 * Triggers haptic feedback if running on a native platform.
 * @param {ImpactStyle} style - The style of the impact (Light, Medium, Heavy, etc.)
 */
export const triggerHaptic = async (style = ImpactStyle.Medium) => {
    if (Capacitor.isNativePlatform()) {
        try {
            await Haptics.impact({ style });
        } catch (e) {
            console.warn('Haptic feedback failed:', e);
        }
    }
};

/**
 * Simple notification haptics for Erfolge/Errors
 */
export const triggerNotification = async (type = 'SUCCESS') => {
    if (Capacitor.isNativePlatform()) {
        try {
            await Haptics.notification({
                type: type === 'SUCCESS' ? 'SUCCESS' : type === 'ERROR' ? 'ERROR' : 'WARNING'
            });
        } catch (e) {
            console.warn('Notification haptic failed:', e);
        }
    }
};
