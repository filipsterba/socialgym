import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('socialGym_xp')) || 0);
    const [level, setLevel] = useState(() => parseInt(localStorage.getItem('socialGym_level')) || 1);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('socialGym_apiKey') || '');
    const [modelName, setModelName] = useState(() => localStorage.getItem('socialGym_modelName') || 'gemini-1.5-flash');

    const [missions, setMissions] = useState(() => {
        const saved = localStorage.getItem('socialGym_missions');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: "Pozdrav prodavačku", xp: 50, completed: false, desc: "Řekni 'Dobrý den' a usměj se." },
            { id: 2, title: "Small Talk Master", xp: 100, completed: false, desc: "Prohoď 3 věty o počasí s cizím člověkem." },
            { id: 3, title: "No Phone Zone", xp: 75, completed: false, desc: "Vydrž 10 minut ve společnosti bez mobilu." },
            { id: 4, title: "Kompliment", xp: 120, completed: false, desc: "Pochval někomu boty nebo outfit." },
            { id: 5, title: "Oční Kontakt", xp: 150, completed: false, desc: "Udrž oční kontakt při placení." }
        ];
    });

    useEffect(() => {
        localStorage.setItem('socialGym_xp', xp);
        localStorage.setItem('socialGym_level', level);
        localStorage.setItem('socialGym_missions', JSON.stringify(missions));
        localStorage.setItem('socialGym_apiKey', apiKey);
        localStorage.setItem('socialGym_modelName', modelName);
    }, [xp, level, missions, apiKey, modelName]);

    const addXp = (amount) => {
        const newXp = xp + amount;
        setXp(newXp);

        // Level up logic
        const xpNeeded = level * 1000;
        if (newXp >= xpNeeded) {
            setLevel(l => l + 1);
            alert(`🎉 LEVEL UP! Nyní jsi Level ${level + 1}!`);
        }
    };

    const completeMission = (id) => {
        setMissions(prev => prev.map(m => {
            if (m.id === id && !m.completed) {
                addXp(m.xp);
                return { ...m, completed: true };
            }
            return m;
        }));
    };

    const resetProgress = () => {
        setXp(0);
        setLevel(1);
        setMissions(missions.map(m => ({ ...m, completed: false })));
    };

    const saveApiKey = (key) => {
        setApiKey(key);
    };

    return (
        <GameContext.Provider value={{ xp, level, missions, completeMission, addXp, resetProgress, apiKey, saveApiKey, modelName, setModelName }}>
            {children}
        </GameContext.Provider>
    );
};
