import { useState, useEffect } from 'react';

export const useTheme = (themePref, setThemePref) => {
    const [systemIsDark, setSystemIsDark] = useState(
        window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
    );

    useEffect(() => {
        localStorage.setItem('vocabapp_theme', themePref);

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

    const cycleTheme = () => {
        if (themePref === 'system') setThemePref('light');
        else if (themePref === 'light') setThemePref('dark');
        else setThemePref('system');
    };

    const getThemeText = () => {
        if (themePref === 'system') return 'Sistem';
        return themePref === 'dark' ? 'Karanlık' : 'Aydınlık';
    };

    return { isDark, cycleTheme, getThemeText };
};
