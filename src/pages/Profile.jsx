import React from 'react';
import { useGame } from '../context/GameContext';
import { User, Shield, Zap, Award } from 'lucide-react';

const Profile = () => {
    const { xp, level, missions, resetProgress } = useGame();

    const completedMissions = missions.filter(m => m.completed).length;
    const totalMissions = missions.length;
    const nextLevelXp = level * 1000;
    const progressPercent = Math.min((xp / nextLevelXp) * 100, 100);

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px var(--primary-glow)'
                }}>
                    <User size={60} color="#000" />
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Social Warrior</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>Level {level}</p>

                <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    <span>{xp} XP</span>
                    <span>{nextLevelXp} XP do dalšího levelu</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <StatCard icon={<Shield color="#ff0055" />} label="Splněné Mise" value={`${completedMissions}/${totalMissions}`} />
                    <StatCard icon={<Zap color="#00f2ea" />} label="Celkové XP" value={xp} />
                    <StatCard icon={<Award color="#7000ff" />} label="Hodnost" value={level < 5 ? "Začátečník" : "Mistr"} />
                </div>

                <button
                    onClick={resetProgress}
                    style={{
                        marginTop: '3rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'underline',
                        fontSize: '0.9rem',
                        opacity: 0.6
                    }}
                >
                    Resetovat progress (pro vývojáře)
                </button>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ marginBottom: '0.5rem' }}>{icon}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
    </div>
);

export default Profile;
