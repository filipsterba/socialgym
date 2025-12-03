import React, { useState } from 'react';
import WebcamTracker from '../components/WebcamTracker';
import VoiceAnalyzer from '../components/VoiceAnalyzer';
import ArgumentSimulator from '../components/ArgumentSimulator';
import DatingSimulator from '../components/DatingSimulator';
import SmallTalkSimulator from '../components/SmallTalkSimulator';
import { Eye, Mic, MessageCircle, Heart, Coffee } from 'lucide-react';

const Training = () => {
    const [activeTab, setActiveTab] = useState('eye');

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Training Dojo</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Vyber si, co chceš dneska potrénovat. Nezapomeň, že bolest je jen slabost opouštějící tělo.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                <TabButton
                    active={activeTab === 'eye'}
                    onClick={() => setActiveTab('eye')}
                    icon={<Eye size={20} />}
                    label="Oční Kontakt"
                />
                <TabButton
                    active={activeTab === 'voice'}
                    onClick={() => setActiveTab('voice')}
                    icon={<Mic size={20} />}
                    label="Hlas & Tón"
                />
                <TabButton
                    active={activeTab === 'argument'}
                    onClick={() => setActiveTab('argument')}
                    icon={<MessageCircle size={20} />}
                    label="Simulátor Hádek"
                />
                <TabButton
                    active={activeTab === 'dating'}
                    onClick={() => setActiveTab('dating')}
                    icon={<Heart size={20} />}
                    label="Rande"
                />
                <TabButton
                    active={activeTab === 'smalltalk'}
                    onClick={() => setActiveTab('smalltalk')}
                    icon={<Coffee size={20} />}
                    label="Small Talk"
                />
            </div>

            <div className="fade-in">
                {activeTab === 'eye' && <WebcamTracker />}
                {activeTab === 'voice' && <VoiceAnalyzer />}
                {activeTab === 'argument' && <ArgumentSimulator />}
                {activeTab === 'dating' && <DatingSimulator />}
                {activeTab === 'smalltalk' && <SmallTalkSimulator />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '1rem 2rem',
            borderRadius: '100px',
            background: active ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: active ? '#000' : 'var(--text-muted)',
            fontWeight: '600',
            border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }}
    >
        {icon} {label}
    </button>
);

export default Training;
