import { useState, useEffect, useCallback } from 'react';

export const useAdmin = (userEmail) => {
    const [isAdmin, setIsAdmin] = useState(() => {
        const stored = sessionStorage.getItem('vocabapp_isAdmin');
        if (stored !== null) return stored === 'true';
        return false;
    });

    const [versionClickCount, setVersionClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(0);

    const handleVersionClick = useCallback(() => {
        const now = Date.now();
        let newCount;

        if (now - lastClickTime < 1000) {
            newCount = versionClickCount + 1;
        } else {
            newCount = 1;
        }

        setVersionClickCount(newCount);
        setLastClickTime(now);

        if (newCount >= 5) {
            setVersionClickCount(0);
            return true;
        }
        return false;
    }, [lastClickTime, versionClickCount]);

    const verifyMasterKey = (key) => {
        if (key === '00741') {
            const newState = !isAdmin;
            setIsAdmin(newState);
            if (newState) {
                sessionStorage.setItem('vocabapp_isAdmin', 'true');
            } else {
                sessionStorage.removeItem('vocabapp_isAdmin');
            }
            return true;
        }
        return false;
    };

    const logoutAdmin = () => {
        setIsAdmin(false);
        sessionStorage.removeItem('vocabapp_isAdmin');
    };

    return { isAdmin, handleVersionClick, verifyMasterKey, resetClickCount: () => setVersionClickCount(0), logoutAdmin };
};
