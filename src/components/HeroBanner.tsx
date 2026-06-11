import { useEffect, useRef } from 'react';
import { Play, Calendar, MapPin, Award } from 'lucide-react';

interface HeroBannerProps {
  onWatchTrailer: () => void;
  onJoinPremiere: () => void;
}

export default function HeroBanner({ onWatchTrailer, onJoinPremiere }: HeroBannerProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Mouse Spotlight tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spotlightRef.current.style.setProperty('--mouse-x', `${x}%`);
      spotlightRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 2. Canvas Floating Particles (Cinematic Dust Motes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Mote {
      x: number = Math.random() * width;
      y: number = Math.random() * height;
      size: number = Math.random() * 2 + 0.5;
      speedX: number = Math.random() * 0.15 - 0.075;
      speedY: number = Math.random() * 0.2 - 0.3; // Floating upwards
      opacity: number = Math.random() * 0.5 + 0.1;
      fadeSpeed: number = Math.random() * 0.005 + 0.002;

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if goes off screen
        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
        if (this.x < -10 || this.x > width + 10) {
          this.x = Math.random() * width;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(197, 160, 89, ${this.opacity})`; // Soft Gold particles
        c.shadowBlur = 6;
        c.shadowColor = 'rgba(197, 160, 89, 0.4)';
        c.fill();
        c.shadowBlur = 0; // Reset shadow
      }
    }

    const motes: Mote[] = Array.from({ length: 45 }, () => new Mote());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      motes.forEach((mote) => {
        mote.update();
        mote.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '650px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(20px, 6vw, 80px)',
        backgroundColor: '#050505'
      }}
    >
      {/* 1. Cinematic Background Zoom Frame */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('/Couple-Photoshoot-in-kotagiri-7-1024x683.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          zIndex: 1,
          animation: 'ken-burns 25s infinite alternate ease-in-out'
        }}
      />
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.08) translate(1%, -0.5%); }
        }
      `}</style>

      {/* 2. Soft Film Grain Noise */}
      <div className="film-grain" />

      {/* 3. Dark Luxury Overlays & Vignettes */}
      {/* Bottom fade out to background */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background: 'linear-gradient(to top, #0a0a0a 0%, rgba(10, 10, 10, 0.7) 40%, transparent 100%)',
          zIndex: 3
        }}
      />
      {/* Left side overlay to make text highly readable */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 50%, rgba(10, 10, 10, 0) 100%)',
          zIndex: 2
        }}
      />
      {/* Corner deep red ambient glows */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '60%',
          background: 'radial-gradient(ellipse at top right, rgba(139, 16, 20, 0.18) 0%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* 4. Canvas Floating Dust Motes */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 4
        }}
      />

      {/* 5. Moving Spotlight Tracker */}
      <div
        ref={spotlightRef}
        className="cursor-spotlight"
        style={{
          zIndex: 4,
          '--mouse-x': '50%',
          '--mouse-y': '50%'
        } as React.CSSProperties}
      />

      {/* 6. Featured Contents */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '650px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '60px'
        }}
      >
        {/* Subtitle / Streaming Platform Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-cinzel)',
            letterSpacing: '0.3em',
            fontSize: '0.8rem',
            color: 'var(--accent-gold)'
          }}
        >
          <Award size={16} />
          <span>A ARIYA DIARY ORIGINAL DOCUMENTARY</span>
        </div>

        {/* Title */}
        <h1
          className="luxury-heading"
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.0,
            textShadow: '2px 2px 10px rgba(0,0,0,0.8)'
          }}
        >
          AARAV <br />
          <span style={{ color: 'var(--accent-gold)' }}>&</span> SIYA
        </h1>

        {/* Metadatas */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          <span style={{ color: '#46d369', fontWeight: 600 }}>99% Match</span>
          <span style={{ border: '1px solid rgba(255,255,255,0.4)', padding: '1px 6px', fontSize: '0.75rem', borderRadius: '3px' }}>
            U/A 16+
          </span>
          <span style={{ color: 'var(--text-white)' }}>2026</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>1 Episode (The Wedding)</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--text-gray)' }}>
            <MapPin size={14} /> Jodhpur, Rajasthan
          </span>
        </div>

        {/* Cinematic Description */}
        <p
          style={{
            color: 'var(--text-gray)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
            lineHeight: '1.6',
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
            fontWeight: 300
          }}
        >
          After a chance encounter and a thousand shared smiles, Aarav & Siya are setting off on their greatest adventure yet. You are cordially invited to watch their story unfold and witness the grand premiere of their forever. Only on December 18th, 2026.
        </p>

        {/* Tag List */}
        <div style={{ display: 'flex', gap: '15px', color: 'var(--text-white)', fontSize: '0.85rem', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>• Emotional</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>• Romantic</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>• Royal Celebration</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
          <button
            className="btn-cinema btn-primary-red"
            onClick={onWatchTrailer}
            style={{ padding: '14px 32px' }}
          >
            <Play fill="#fff" size={18} />
            Watch Trailer
          </button>
          
          <button
            className="btn-cinema btn-secondary-dark"
            onClick={onJoinPremiere}
            style={{ padding: '14px 32px' }}
          >
            <Calendar size={18} style={{ color: 'var(--accent-gold)' }} />
            Join Premiere
          </button>
        </div>
      </div>
    </section>
  );
}
