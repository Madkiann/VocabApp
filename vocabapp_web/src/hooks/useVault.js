import { useState, useCallback } from 'react';

export const useVault = () => {
    const [savedWords, setSavedWords] = useState([]);
    const [vaultFolders, setVaultFolders] = useState(['General']);
    const [activeVaultFolder, setActiveVaultFolder] = useState(null);
    const [selectedVaultWord, setSelectedVaultWord] = useState(null);
    const [showVault, setShowVault] = useState(false);
    const [showQuizHistory, setShowQuizHistory] = useState(false);

    const toggleSaveWord = useCallback((word) => {
        setSavedWords(prev => {
            if (prev.some(w => w.id === word.id)) {
                return prev.filter(w => w.id !== word.id);
            }
            return [...prev, { ...word, folder: 'General' }];
        });
    }, []);

    const updateWordFolder = useCallback((wordId, folderName) => {
        setSavedWords(prev => prev.map(w => w.id === wordId ? { ...w, folder: folderName } : w));
    }, []);

    const deleteVaultFolder = useCallback((folderName) => {
        if (folderName === 'General') return;
        setVaultFolders(prev => prev.filter(f => f !== folderName));
        setSavedWords(prev => prev.map(w => w.folder === folderName ? { ...w, folder: 'General' } : w));
    }, []);

    const renameVaultFolder = useCallback((oldName, newName) => {
        const trimmed = newName.trim();
        if (oldName === 'General' || !trimmed || vaultFolders.includes(trimmed)) return;
        setVaultFolders(prev => prev.map(f => f === oldName ? trimmed : f));
        setSavedWords(prev => prev.map(w => w.folder === oldName ? { ...w, folder: trimmed } : w));
    }, [vaultFolders]);

    return {
        savedWords, setSavedWords,
        vaultFolders, setVaultFolders,
        activeVaultFolder, setActiveVaultFolder,
        selectedVaultWord, setSelectedVaultWord,
        showVault, setShowVault,
        showQuizHistory, setShowQuizHistory,
        toggleSaveWord,
        updateWordFolder,
        deleteVaultFolder,
        renameVaultFolder
    };
};
