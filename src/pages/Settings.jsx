import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Settings as SettingsIcon, Save, Key, Activity, Cpu, Search } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Settings = () => {
    const { apiKey, saveApiKey, modelName, setModelName } = useGame();
    const [inputKey, setInputKey] = useState(apiKey);
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [availableModels, setAvailableModels] = useState([
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-1.0-pro"
    ]);

    const handleSave = () => {
        const trimmedKey = inputKey.trim();
        saveApiKey(trimmedKey);
        setStatus('Uloženo! ✅');
        setTimeout(() => setStatus(''), 2000);
    };

    const handleTest = async () => {
        setIsLoading(true);
        setStatus('Testuji...');
        try {
            const genAI = new GoogleGenerativeAI(inputKey.trim());
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            if (response.text()) {
                setStatus('Funguje to! 🎉');
            }
        } catch (error) {
            console.error(error);
            setStatus(`Chyba: ${error.message || 'Neplatný klíč'}`);
        }
        setIsLoading(false);
    };

    const fetchModels = async () => {
        if (!inputKey) {
            setStatus('Nejdřív vlož API klíč.');
            return;
        }
        setIsLoading(true);
        setStatus('Hledám modely...');
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${inputKey.trim()}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            if (data.models) {
                // Filter for models that support generateContent
                const chatModels = data.models
                    .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                    .map(m => m.name.replace('models/', ''));

                if (chatModels.length > 0) {
                    setAvailableModels(chatModels);
                    setModelName(chatModels[0]);
                    setStatus(`Nalezeno ${chatModels.length} modelů! ✅`);
                } else {
                    setStatus('Žádné chatovací modely nenalezeny.');
                }
            }
        } catch (error) {
            console.error(error);
            setStatus(`Chyba při hledání: ${error.message}`);
        }
        setIsLoading(false);
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <SettingsIcon size={32} /> Nastavení
                </h1>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        Google Gemini API Key
                    </label>
                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                        <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="Vlož svůj API klíč..."
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '100px',
                                padding: '1rem 1rem 1rem 3rem',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        AI Model
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Cpu size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select
                                value={modelName}
                                onChange={(e) => setModelName(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '100px',
                                    padding: '1rem 1rem 1rem 3rem',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {availableModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={fetchModels}
                            disabled={isLoading}
                            title="Načíst dostupné modely pro tento klíč"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                cursor: isLoading ? 'wait' : 'pointer'
                            }}
                        >
                            <Search size={20} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleSave}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
                        >
                            <Save size={18} /> Uložit
                        </button>
                        <button
                            onClick={handleTest}
                            disabled={isLoading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                flex: 1,
                                justifyContent: 'center',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '100px',
                                color: '#fff',
                                cursor: isLoading ? 'wait' : 'pointer'
                            }}
                        >
                            <Activity size={18} /> {isLoading ? 'Testuji...' : 'Otestovat'}
                        </button>
                    </div>

                    {status && <p style={{ color: status.startsWith('Chyba') ? '#ff0055' : '#00f2ea', marginTop: '1rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', wordBreak: 'break-word' }}>{status}</p>}

                    <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Pokud nevíte, jaký model vybrat, klikněte na ikonu <strong>lupy</strong> vedle výběru modelu.
                        Aplikace se zeptá Google API, jaké modely máte povolené.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
