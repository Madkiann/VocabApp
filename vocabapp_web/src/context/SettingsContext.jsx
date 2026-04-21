
import React, { createContext, useState, useEffect, useContext } from 'react';
import { sounds } from '../utils/sounds';
import { useAdmin } from '../hooks/useAdmin';
import { translations } from '../data/translations';
import { syncStorage } from '../utils/storage';

export const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [appLang, setAppLang] = useState('tr');
    const t = translations[appLang];
    
    // Auth / Admin State
    const [userEmail, setUserEmail] = useState(null);
    const { isAdmin, handleVersionClick, verifyMasterKey } = useAdmin(userEmail);

    // Theme State
    const [themePref, setThemePref] = useState(() => syncStorage.getItem('vocabapp_theme') || 'system');
    const [systemIsDark, setSystemIsDark] = useState(window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false);
    
    // UI Persistence
    const [soundEnabled, setSoundEnabled] = useState(() => syncStorage.getItem('vocabapp_sound_enabled') !== 'false');
    const [maintenanceMode, setMaintenanceMode] = useState(() => syncStorage.getItem('vocabapp_maintenance') === 'true');
    const [sm2Multiplier, setSm2Multiplier] = useState(() => parseFloat(syncStorage.getItem('vocabapp_sm2_multiplier') || '1.0'));
    const [globalAnnouncement, setGlobalAnnouncement] = useState(() => syncStorage.getItem('vocabapp_announcement') || '');
    const [geminiApiKey, setGeminiApiKey] = useState(() => syncStorage.getItem('vocabapp_gemini_api_key') || '');

    // Theme Effect
    useEffect(() => {
        syncStorage.setItem('vocabapp_theme', themePref);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemIsDark(mediaQuery.matches);

        const handler = (e) => setSystemIsDark(e.matches);
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            mediaQuery.addListener(handler);
            return () => mediaQuery.removeListener(handler);
        }
    }, [themePref]);

    const isDark = themePref === 'system' ? systemIsDark : themePref === 'dark';

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }

        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = isDark ? '#051025' : '#f1f5f9';
    }, [isDark]);

    // Sound & Sub-states Persistence
    useEffect(() => {
        sounds.enabled = soundEnabled;
        syncStorage.setItem('vocabapp_sound_enabled', soundEnabled);
    }, [soundEnabled]);

    useEffect(() => syncStorage.setItem('vocabapp_maintenance', String(maintenanceMode)), [maintenanceMode]);
    useEffect(() => syncStorage.setItem('vocabapp_sm2_multiplier', sm2Multiplier.toString()), [sm2Multiplier]);
    useEffect(() => syncStorage.setItem('vocabapp_announcement', globalAnnouncement), [globalAnnouncement]);
    useEffect(() => syncStorage.setItem('vocabapp_gemini_api_key', geminiApiKey), [geminiApiKey]);

    const cycleTheme = () => {
        if (themePref === 'system') setThemePref('light');
        else if (themePref === 'light') setThemePref('dark');
        else setThemePref('system');
    };

    const getThemeText = () => {
        if (themePref === 'system') return 'Sistem';
        return themePref === 'dark' ? 'Karanlık' : 'Aydınlık';
    };

    const value = {
        appLang, setAppLang, t,
        isAdmin, handleVersionClick, verifyMasterKey, userEmail, setUserEmail,
        themePref, setThemePref, isDark, cycleTheme, getThemeText,
        soundEnabled, setSoundEnabled,
        maintenanceMode, setMaintenanceMode,
        sm2Multiplier, setSm2Multiplier,
        globalAnnouncement, setGlobalAnnouncement,
        geminiApiKey, setGeminiApiKey
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
