import React from 'react';
import { useGame } from '../context/GameContext';
import { CheckCircle, Circle, Trophy } from 'lucide-react';

const Missions = () => {
    const { missions, completeMission, xp, level } = useGame();

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Denní Mise</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Plň úkoly v reálném světě a získávej XP. Není to jen hra, je to tvůj život.
                </p>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '100px',
                    marginTop: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Level {level}</span>
                    <span style={{ width: '1px', height: '15px', background: 'rgba(255,255,255,0.2)' }}></span>
                    <span style={{ color: '#fff' }}>{xp} XP</span>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                {missions.map((mission) => (
                    <div key={mission.id} className="glass-panel" style={{
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        opacity: mission.completed ? 0.6 : 1,
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <button
                                onClick={() => completeMission(mission.id)}
                                disabled={mission.completed}
                                style={{
                                    color: mission.completed ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: mission.completed ? 'default' : 'pointer',
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => !mission.completed && (e.currentTarget.style.transform = 'scale(1.1)')}
                                onMouseLeave={(e) => !mission.completed && (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {mission.completed ? <CheckCircle size={32} /> : <Circle size={32} />}
                            </button>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', textDecoration: mission.completed ? 'line-through' : 'none' }}>
                                    {mission.title}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{mission.desc}</p>
                            </div>
                        </div>

                        <div style={{
                            background: mission.completed ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                            color: mission.completed ? '#000' : 'var(--primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Trophy size={16} /> {mission.xp} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Missions;
