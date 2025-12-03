import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Mic, MessageCircle, Zap } from 'lucide-react';

const Home = () => {
    return (
        <div className="container">
            <section className="hero" style={{
                textAlign: 'center',
                padding: '8rem 0 6rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2.5rem',
                position: 'relative'
            }}>
                <div className="hero-glow" />

                <div className="fade-in" style={{ animationDelay: '0.1s' }}>
                    <span style={{
                        background: 'rgba(0, 242, 234, 0.1)',
                        color: 'var(--primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '100px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid rgba(0, 242, 234, 0.2)'
                    }}>
                        AI SOCIAL COACH v1.0
                    </span>
                </div>

                <h1 className="fade-in" style={{
                    fontSize: 'clamp(3rem, 6vw, 5rem)',
                    lineHeight: 1.1,
                    maxWidth: '900px',
                    fontWeight: 900,
                    animationDelay: '0.2s'
                }}>
                    Přestaň být NPC.<br />
                    <span className="title-gradient">Staň se Main Character.</span>
                </h1>

                <p className="fade-in" style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-muted)',
                    maxWidth: '600px',
                    lineHeight: 1.6,
                    animationDelay: '0.3s'
                }}>
                    Digitální trenér sociálních dovedností. Trénuj oční kontakt, hlas a charisma s AI,
                    abys v reálném světě nebyl za exota.
                </p>

                <div className="fade-in" style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginTop: '1rem',
                    animationDelay: '0.4s'
                }}>
                    <Link to="/training" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#000' }}>
                        Začít Trénink <ArrowRight size={20} />
                    </Link>
                    <button className="btn-secondary">
                        Jak to funguje?
                    </button>
                </div>
            </section>

            <section className="features-grid fade-in" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
                padding: '2rem 0 6rem',
                animationDelay: '0.6s'
            }}>
                <FeatureCard
                    icon={<Eye size={32} color="var(--primary)" />}
                    title="Oční Kontakt"
                    desc="Webcam AI hlídá, jestli neuhýbáš pohledem. Vydrž to a nezírej jak vrah."
                    delay="0.1s"
                />
                <FeatureCard
                    icon={<Mic size={32} color="#ff0055" />}
                    title="Analýza Hlasu"
                    desc="Mluvíš moc potichu? Moc rychle? AI ti to řekne narovinu a naučí tě mluvit."
                    delay="0.2s"
                />
                <FeatureCard
                    icon={<MessageCircle size={32} color="#7000ff" />}
                    title="Simulátor Hádek"
                    desc="Trénuj argumentaci s AI, která se s tebou nebude mazlit. Připrav se na realitu."
                    delay="0.3s"
                />
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <div className="glass-panel" style={{
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        height: '100%',
        animation: `fadeIn 0.8s ease-out forwards ${delay}`,
        opacity: 0,
        transform: 'translateY(20px)'
    }}>
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
        </div>
    </div>
);

export default Home;
