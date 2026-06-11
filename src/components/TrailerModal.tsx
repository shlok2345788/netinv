import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface Slide {
  image: string;
  subtitle: string;
  title: string;
}

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const slides: Slide[] = [
    {
      image: '/images.jpg',
      title: 'ACT I: THE FIRST ENCOUNTER',
      subtitle: 'It began with a casual glance, in a crowded room where time suddenly stood still...'
    },
    {
      image: '/Couple-Photoshoot-in-kotagiri-7-1024x683.jpg',
      title: 'ACT II: THE ADVENTURE',
      subtitle: 'Through laughing in the rain, traveling the world, and building a galaxy of inside jokes...'
    },
    {
      image: '/images (1).jpg',
      title: 'ACT III: THE PROPOSAL',
      subtitle: 'Until under a canopy of stars and shimmering fairy lights, a simple "Yes" paved our way to forever.'
    },
    {
      image: '/images (2).jpg',
      title: 'ACT IV: THE CELEBRATION',
      subtitle: 'Now, the rhythm of our hearts merges with the beats of celebration, laughter, and dance...'
    },
    {
      image: '/Couple-Photoshoot-in-kotagiri-7-1024x683.jpg',
      title: 'THE GRAND PREMIERE',
      subtitle: 'We invite you to witness the culmination of our love story. The premiere of Aarav & Siya.'
    }
  ];

  // 1. Auto play slides
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, slides.length]);

  // 2. Audio control sync
  useEffect(() => {
    if (isOpen) {
      soundEngine.startTheme();
      soundEngine.setVolume(isAudioMuted ? 0 : 0.8);
    }
  }, [isOpen, isAudioMuted]);

  if (!isOpen) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleAudio = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    soundEngine.setVolume(nextMute ? 0 : 0.8);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#050505',
        zIndex: 99990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Red ambient background glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          boxShadow: 'inset 0 0 100px rgba(139, 16, 20, 0.4)',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          background: 'rgba(20, 20, 20, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#fff',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.borderColor = 'var(--accent-red)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
      >
        <X size={24} />
      </button>

      {/* The cinematic projector screen (Active Slide) */}
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              {/* Image Frame with Zoom */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url('${slide.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.6) contrast(1.15)',
                  transform: isActive ? 'scale(1.06)' : 'scale(1.0)',
                  transition: isActive ? 'transform 5.2s ease-out' : 'none'
                }}
              />

              {/* Subtitles & Captions overlay */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    width: '90%',
                    maxWidth: '850px',
                    textAlign: 'center',
                    padding: '24px 30px',
                    borderRadius: '8px',
                    background: 'rgba(5, 5, 5, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-cinzel)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.3em',
                      color: 'var(--accent-gold)',
                      marginBottom: '10px',
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    {slide.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-outfit)',
                      fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)',
                      color: '#ffffff',
                      lineHeight: '1.6',
                      fontWeight: 300,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {slide.subtitle}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, transparent 40%, rgba(5,5,5,0.8) 85%, #050505 100%)',
          pointerEvents: 'none',
          zIndex: 4
        }}
      />

      {/* Controls Overlay bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          background: 'rgba(20, 20, 20, 0.85)',
          padding: '12px 30px',
          borderRadius: '30px',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <button
          onClick={prevSlide}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'var(--accent-red)',
            border: 'none',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 10px var(--accent-red-glow)'
          }}
        >
          {isPlaying ? <Pause size={18} fill="#fff" /> : <Play size={18} fill="#fff" style={{ marginLeft: '2px' }} />}
        </button>

        <button
          onClick={nextSlide}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <ChevronRight size={20} />
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <button
          onClick={toggleAudio}
          style={{
            background: 'none',
            border: 'none',
            color: isAudioMuted ? 'var(--accent-red)' : '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', fontFamily: 'var(--font-outfit)', fontWeight: 500 }}>
            {isAudioMuted ? 'MUTED' : 'CINEMATIC AUDIO'}
          </span>
        </button>

        {/* Music Soundwave Visualizer */}
        {!isAudioMuted && isPlaying && (
          <div className="visualizer-container" style={{ scale: '0.7', transformOrigin: 'bottom' }}>
            <div className="visualizer-bar" />
            <div className="visualizer-bar" />
            <div className="visualizer-bar" />
            <div className="visualizer-bar" />
            <div className="visualizer-bar" />
          </div>
        )}
      </div>

      {/* Progress indicators at the top */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 50
        }}
      >
        {slides.map((_, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={idx}
              style={{
                width: '30px',
                height: '3px',
                backgroundColor: isActive ? 'var(--accent-red)' : 'rgba(255,255,255,0.2)',
                boxShadow: isActive ? '0 0 8px var(--accent-red)' : 'none',
                borderRadius: '2px',
                transition: 'all 0.4s ease'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
