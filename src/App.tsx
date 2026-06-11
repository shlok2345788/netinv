import { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import HeroBanner from './components/HeroBanner';
import TrailerModal from './components/TrailerModal';
import EpisodesTimeline from './components/EpisodesTimeline';
import ContinueWatching from './components/ContinueWatching';
import VenueDetails from './components/VenueDetails';
import RSVPPremier from './components/RSVPPremier';
import { soundEngine } from './utils/audioSynth';
import { Volume2, VolumeX, Menu, X, Film } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Detect scrolling to add background to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setMobileMenuOpen(false);
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleGlobalAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    if (nextMuted) {
      soundEngine.stopTheme();
    } else {
      soundEngine.startTheme();
      soundEngine.setVolume(0.6);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      
      {/* 1. Cinematic Intro Screen */}
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}

      {/* Ambient backgrounds */}
      <div className="film-grain" />
      <div className="ambient-vignette" />

      {/* 2. Global Navigation Header */}
      {!showIntro && (
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(20px, 6vw, 80px)',
            zIndex: 900,
            backgroundColor: isHeaderScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
            backdropFilter: isHeaderScrolled ? 'blur(12px)' : 'none',
            borderBottom: isHeaderScrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
            transition: 'background-color 0.4s ease, border-bottom 0.4s ease'
          }}
        >
          {/* Snapflix Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: '1.7rem',
                fontWeight: 900,
                color: 'var(--accent-red)',
                letterSpacing: '2px',
                textShadow: '0 0 10px rgba(229, 9, 20, 0.2)'
              }}
            >
              ARIYA DIARY
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '30px',
              fontFamily: 'var(--font-outfit)',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
            className="desktop-nav-only"
          >
            <style>{`
              @media (min-width: 768px) {
                .desktop-nav-only { display: flex !important; }
                .mobile-menu-trigger { display: none !important; }
              }
            `}</style>
            
            {['Home', 'Episodes', 'Venue', 'RSVP'].map((item) => (
              <span
                key={item}
                onClick={() => {
                  if (item === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
                  else scrollToSection(item.toLowerCase());
                }}
                style={{
                  color: 'var(--text-gray)',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
              >
                {item === 'Venue' ? 'Premiere Location' : item}
              </span>
            ))}

            <button
              onClick={() => scrollToSection('rsvp')}
              className="btn-cinema btn-primary-red"
              style={{ padding: '8px 20px', fontSize: '0.8rem' }}
            >
              Join Premiere
            </button>
          </nav>

          {/* Mobile Hamburguer Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-trigger"
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              zIndex: 999
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
      )}

      {/* 3. Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: '#0a0a0a',
            zIndex: 899,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            fontFamily: 'var(--font-cinzel)',
            fontSize: '1.5rem',
            letterSpacing: '0.1em'
          }}
        >
          {['Home', 'Episodes', 'Venue', 'RSVP'].map((item) => (
            <span
              key={item}
              onClick={() => {
                if (item === 'Home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                } else {
                  scrollToSection(item.toLowerCase());
                }
              }}
              style={{ color: '#fff', cursor: 'pointer' }}
            >
              {item === 'Venue' ? 'Location' : item}
            </span>
          ))}

          <button
            onClick={() => scrollToSection('rsvp')}
            className="btn-cinema btn-primary-red"
            style={{ padding: '12px 30px', fontSize: '1rem', marginTop: '20px' }}
          >
            Join Premiere
          </button>
        </div>
      )}

      {/* 4. Main Page Sections (Rendered only after intro screen is cleared) */}
      {!showIntro && (
        <>
          <HeroBanner
            onWatchTrailer={() => setShowTrailer(true)}
            onJoinPremiere={() => scrollToSection('rsvp')}
          />
          
          <EpisodesTimeline />
          
          <ContinueWatching />
          
          <VenueDetails />
          
          <RSVPPremier />

          {/* 5. Netflix Original Movie Credits Style Footer */}
          <footer
            style={{
              backgroundColor: '#050505',
              padding: '60px clamp(20px, 6vw, 80px) 40px clamp(20px, 6vw, 80px)',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              color: 'var(--text-gray)',
              fontSize: '0.8rem',
              position: 'relative',
              zIndex: 5
            }}
          >
            <div
              style={{
                maxWidth: '1000px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
              }}
            >
              {/* Footer Mock Social / Info row */}
              <div style={{ display: 'flex', gap: '20px', fontSize: '1.2rem', color: '#fff' }}>
                <Film size={20} style={{ color: 'var(--accent-red)' }} />
                <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '0.9rem', letterSpacing: '0.15em', fontWeight: 600 }}>
                  A STORY OF FOREVER
                </span>
              </div>

              {/* Streaming platform links */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '20px',
                  lineHeight: '2.0'
                }}
              >
                <div>
                  <p style={{ cursor: 'pointer' }}>Registry & Gifts</p>
                  <p style={{ cursor: 'pointer' }}>FAQ & Event Information</p>
                  <p style={{ cursor: 'pointer' }}>Contact Coordinator</p>
                </div>
                <div>
                  <p style={{ cursor: 'pointer' }}>Travel Guidelines</p>
                  <p style={{ cursor: 'pointer' }}>Jodhpur Tourism Guide</p>
                  <p style={{ cursor: 'pointer' }}>Cast & Crew</p>
                </div>
                <div>
                  <p style={{ cursor: 'pointer' }}>Terms of Premiere</p>
                  <p style={{ cursor: 'pointer' }}>Privacy Policy</p>
                  <p style={{ cursor: 'pointer' }}>Original Love Story</p>
                </div>
              </div>

              {/* Technical synthesis credits */}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px',
                  fontSize: '0.72rem'
                }}
              >
                <p>Designed with Love by Aarav & Siya. Built using React + GSAP.</p>
                <p>© 2026 Ariya Diary Originals. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* 6. Cinematic Trailer Theater Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
      />

      {/* 7. Sound Toggle floating visualizer */}
      {!showIntro && (
        <button
          onClick={toggleGlobalAudio}
          className="sound-toggle-btn"
          title={isAudioMuted ? 'Unmute cinematic sound' : 'Mute sound'}
        >
          {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          
          {/* Mini Equalizer visualizer */}
          {!isAudioMuted && (
            <div className="visualizer-container" style={{ scale: '0.55', position: 'absolute', top: '1px', right: '-12px' }}>
              <div className="visualizer-bar" style={{ backgroundColor: 'var(--accent-gold)' }} />
              <div className="visualizer-bar" style={{ backgroundColor: 'var(--accent-gold)' }} />
              <div className="visualizer-bar" style={{ backgroundColor: 'var(--accent-gold)' }} />
            </div>
          )}
        </button>
      )}
    </div>
  );
}
