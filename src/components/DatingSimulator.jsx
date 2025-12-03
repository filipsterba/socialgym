import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Heart } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { generateAIResponse } from '../services/ai';

const DatingSimulator = () => {
    const { apiKey, modelName } = useGame();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Ahoj, všimla jsem si tě u baru. Co piješ?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        const systemPrompt = "Hraješ roli atraktivní dívky na rande. Jsi trochu nedostupná, ale máš zájem, pokud uživatel řekne něco vtipného nebo zajímavého. Pokud je 'needy' nebo nudný, dej mu to najevo. Tvým cílem je otestovat jeho 'rizz'.";

        const response = await generateAIResponse(apiKey, modelName, newMessages, systemPrompt);

        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: response };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    return (
        <div className="glass-panel" style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart color="#ff0055" fill="#ff0055" /> Rande Simulátor
                </h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        gap: '0.5rem'
                    }}>
                        {msg.sender === 'ai' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff0055', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={18} color="#fff" />
                            </div>
                        )}
                        <div style={{
                            maxWidth: '70%',
                            padding: '1rem',
                            borderRadius: '16px',
                            borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '16px',
                            borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                            background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            color: msg.sender === 'user' ? '#000' : '#fff',
                            fontWeight: msg.sender === 'user' ? '600' : '400'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Heart size={16} /> Píše...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Odpověz jí..."
                    style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '100px',
                        padding: '1rem 1.5rem',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <button
                    onClick={handleSend}
                    className="btn-primary"
                    style={{ padding: '0.8rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px' }}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default DatingSimulator;
