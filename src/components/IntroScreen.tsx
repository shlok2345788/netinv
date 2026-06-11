import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { soundEngine } from '../utils/audioSynth';
import { Film, Play } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

type Stage = 'click-to-enter' | 'silence' | 'rumble' | 'impact' | 'reveal-names';

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [stage, setStage] = useState<Stage>('click-to-enter');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLHeadingElement>(null);
  const nowStreamingRef = useRef<HTMLDivElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const dustCanvasRef = useRef<HTMLCanvasElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);

  // 1. Particle & Smoke Canvas Rendering
  useEffect(() => {
    if (stage === 'click-to-enter') return;

    // A. Smoke Canvas behind logo
    const smokeCanvas = smokeCanvasRef.current;
    let smokeCtx: CanvasRenderingContext2D | null = null;
    let smokeFrameId: number;

    if (smokeCanvas) {
      smokeCtx = smokeCanvas.getContext('2d');
      if (smokeCtx) {
        smokeCanvas.width = window.innerWidth;
        smokeCanvas.height = window.innerHeight;

        class SmokeParticle {
          x = window.innerWidth / 2 + (Math.random() * 200 - 100);
          y = window.innerHeight / 2 + (Math.random() * 100 - 50);
          vx = Math.random() * 0.8 - 0.4;
          vy = Math.random() * -0.6 - 0.3;
          size = Math.random() * 100 + 60;
          opacity = Math.random() * 0.35 + 0.05;
          growth = Math.random() * 0.5 + 0.3;

          update() {
            this.x += this.vx;
            this.y += this.vy;
            this.size += this.growth;
            this.opacity -= 0.002;
          }

          draw(c: CanvasRenderingContext2D) {
            c.beginPath();
            const grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, `rgba(229, 9, 20, ${this.opacity})`); // Crimson smoke
            grad.addColorStop(0.4, `rgba(139, 16, 20, ${this.opacity * 0.5})`);
            grad.addColorStop(1, 'rgba(5, 5, 5, 0)');
            c.fillStyle = grad;
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            c.fill();
          }
        }

        let particles: SmokeParticle[] = [];
        const animateSmoke = () => {
          if (!smokeCtx || !smokeCanvas) return;
          smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
          
          if (particles.length < 40 && Math.random() < 0.2) {
            particles.push(new SmokeParticle());
          }

          particles.forEach((p, idx) => {
            p.update();
            p.draw(smokeCtx!);
            if (p.opacity <= 0) {
              particles.splice(idx, 1);
            }
          });

          smokeFrameId = requestAnimationFrame(animateSmoke);
        };

        animateSmoke();
      }
    }

    // B. Floating Gold Dust
    const dustCanvas = dustCanvasRef.current;
    let dustCtx: CanvasRenderingContext2D | null = null;
    let dustFrameId: number;

    if (dustCanvas) {
      dustCtx = dustCanvas.getContext('2d');
      if (dustCtx) {
        dustCanvas.width = window.innerWidth;
        dustCanvas.height = window.innerHeight;

        class DustParticle {
          x = Math.random() * window.innerWidth;
          y = Math.random() * window.innerHeight;
          vx = Math.random() * 0.3 - 0.15;
          vy = Math.random() * -0.4 - 0.2;
          size = Math.random() * 2 + 0.5;
          opacity = Math.random() * 0.7 + 0.15;

          update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -10) this.y = window.innerHeight + 10;
          }

          draw(c: CanvasRenderingContext2D) {
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            c.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
            c.shadowBlur = 6;
            c.shadowColor = 'rgba(197, 160, 89, 0.4)';
            c.fill();
            c.shadowBlur = 0;
          }
        }

        const dustList = Array.from({ length: 50 }, () => new DustParticle());
        const animateDust = () => {
          if (!dustCtx || !dustCanvas) return;
          dustCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
          dustList.forEach((d) => {
            d.update();
            d.draw(dustCtx!);
          });
          dustFrameId = requestAnimationFrame(animateDust);
        };

        animateDust();
      }
    }

    const handleResize = () => {
      if (smokeCanvas) {
        smokeCanvas.width = window.innerWidth;
        smokeCanvas.height = window.innerHeight;
      }
      if (dustCanvas) {
        dustCanvas.width = window.innerWidth;
        dustCanvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(smokeFrameId);
      cancelAnimationFrame(dustFrameId);
    };
  }, [stage]);

  // 2. Timeline Orchestration
  const startTheaterExperience = () => {
    // A. UNLOCK Audio Context immediately inside user event thread!
    soundEngine.unlock();

    // Fade landing screen items out
    gsap.to('.landing-screen-content', {
      opacity: 0,
      scale: 0.96,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        // B. Transition to 1-second silence
        setStage('silence');
        
        // C. At 1.0s: Start sub-drone rumble & sweep whoosh
        setTimeout(() => {
          setStage('rumble');
          soundEngine.startAtmosDrone();
          soundEngine.playWhoosh(2.2);

          // Animate Vertical red line rising & glowing
          if (verticalLineRef.current) {
            gsap.fromTo(verticalLineRef.current,
              { height: '0px', opacity: 0 },
              { height: '300px', opacity: 1, duration: 1.8, ease: 'power3.out' }
            );
          }
        }, 1000);

        // D. At 3.2s: Trigger Tudum Impact
        setTimeout(() => {
          setStage('impact');
          soundEngine.playTudum();

          // Soft theme starts 1.4s later
          setTimeout(() => {
            soundEngine.startTheme();
          }, 1400);

          // Blooming vertical laser line
          if (verticalLineRef.current) {
            gsap.timeline()
              .to(verticalLineRef.current, {
                width: '320px',
                opacity: 1,
                filter: 'blur(10px) brightness(2)',
                backgroundColor: '#e50914',
                duration: 0.12,
                ease: 'power1.out'
              })
              .to(verticalLineRef.current, {
                opacity: 0,
                scaleY: 0,
                duration: 0.3,
                ease: 'power2.in'
              });
          }

          // Staggered cinematic reveal of RONYA DIARY letters
          if (logoTextRef.current) {
            const letters = logoTextRef.current.querySelectorAll('.logo-letter');
            
            // Initial positioning: scattered and blurred
            gsap.fromTo(letters,
              { opacity: 0, scale: 2.5, filter: 'blur(20px)', y: -10 },
              { 
                opacity: 1, 
                scale: 1, 
                filter: 'blur(0px)', 
                y: 0,
                duration: 1.6, 
                stagger: { each: 0.05, from: 'center' },
                ease: 'power4.out'
              }
            );

            // Left-to-right red laser flare sweep
            if (flareRef.current) {
              gsap.fromTo(flareRef.current,
                { left: '-50%', opacity: 0 },
                { left: '150%', opacity: 0.8, duration: 1.8, ease: 'power2.inOut', delay: 0.2 }
              );
            }

            // Slow cinematic push towards camera
            gsap.to(logoTextRef.current, {
              scale: 1.05,
              duration: 3.2,
              ease: 'power1.inOut',
              delay: 0.2
            });
          }

          // E. Fade logo out at 6.6s (3.4s after impact)
          setTimeout(() => {
            if (logoTextRef.current) {
              gsap.to(logoTextRef.current, {
                opacity: 0,
                filter: 'blur(15px)',
                scale: 0.97,
                duration: 1.2,
                ease: 'power3.in',
                onComplete: () => {
                  revealNamesTimeline();
                }
              });
            }
          }, 3400);

        }, 3200);
      }
    });
  };

  // Stage E: Reveal Aarav & Siya
  const revealNamesTimeline = () => {
    setStage('reveal-names');

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out whole container to home
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.5,
          ease: 'power3.inOut',
          onComplete: onComplete
        });
      }
    });

    if (nowStreamingRef.current) {
      tl.fromTo(nowStreamingRef.current.children,
        { opacity: 0, y: 35, filter: 'blur(12px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 1.6, 
          stagger: 0.5, 
          ease: 'power3.out' 
        }
      )
      // Slow zoom
      .to(nowStreamingRef.current, {
        scale: 1.04,
        duration: 3.5,
        ease: 'power1.out',
        delay: -2.0
      })
      .to(nowStreamingRef.current, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1.2,
        ease: 'power2.in',
        delay: 1.2
      });
    }
  };

  const logoLetters = "ARIYA DIARY".split("");

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        overflow: 'hidden'
      }}
    >
      {/* Dynamic radial spotlight theater gradient */}
      {stage !== 'click-to-enter' && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(139,16,20,0.14) 0%, rgba(5,5,5,0) 80%)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'ambientPulse 5s infinite alternate ease-in-out'
          }}
        />
      )}
      <style>{`
        @keyframes ambientPulse {
          0% { opacity: 0.6; }
          100% { opacity: 1.0; }
        }
        .logo-letter {
          display: inline-block;
          transform-origin: center;
        }
        .shine-effect {
          background: linear-gradient(120deg, #ff1f27 30%, #ffffff 50%, #ff1f27 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .pulse-btn {
          animation: pulseGlow 2.5s infinite ease-in-out;
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(229, 9, 20, 0.4); transform: scale(1); }
          50% { box-shadow: 0 0 30px rgba(229, 9, 20, 0.8); transform: scale(1.03); }
          100% { box-shadow: 0 0 15px rgba(229, 9, 20, 0.4); transform: scale(1); }
        }
      `}</style>

      {/* STAGE: Click to Enter (Eye-Catching Fullscreen Cinematic Splash Cover) */}
      {stage === 'click-to-enter' && (
        <div
          className="landing-screen-content"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}
        >
          {/* Dark blurred couple portrait background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url('/Couple-Photoshoot-in-kotagiri-7-1024x683.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(10px) brightness(0.20)',
              zIndex: 1,
              transform: 'scale(1.02)'
            }}
          />

          {/* Theater lighting vignette */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, transparent 20%, rgba(5,5,5,0.7) 70%, #050505 100%), linear-gradient(to top, rgba(139,16,20,0.18) 0%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />

          {/* Title Cards */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              padding: '0 20px',
              maxWidth: '650px'
            }}
          >
            <div style={{ color: 'var(--accent-gold)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Film size={20} style={{ color: 'var(--accent-gold)', filter: 'drop-shadow(0 0 5px var(--accent-gold-glow))' }} />
              <span style={{ fontSize: '0.82rem', letterSpacing: '0.35em', fontWeight: 600, fontFamily: 'var(--font-cinzel)', textShadow: '0 0 10px rgba(197,160,89,0.3)' }}>
                A ARIYA DIARY ORIGINAL
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '0.2em',
                color: '#fff',
                textShadow: '0 10px 30px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.05)',
                margin: 0,
                lineHeight: '1.2'
              }}
            >
              AARAV <span style={{ color: 'var(--accent-gold)', fontWeight: 400 }}>&</span> SIYA
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                color: 'var(--text-gray)',
                fontSize: '0.98rem',
                letterSpacing: '0.12em',
                lineHeight: '1.7',
                fontWeight: 300,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              Experience an immersive romantic trailer invitation. Toggle your audio on for the full surround-sound theater experience.
            </p>

            {/* Glowing play button */}
            <button
              className="btn-cinema btn-primary-red pulse-btn"
              onClick={startTheaterExperience}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                marginTop: '15px',
                padding: '16px 40px',
                borderRadius: '30px',
                fontSize: '1rem',
                letterSpacing: '0.15em',
                boxShadow: '0 0 20px var(--accent-red-glow)',
                border: 'none'
              }}
            >
              <Play fill="#fff" size={18} />
              Unlock Theater
            </button>
          </div>
        </div>
      )}

      {/* STAGE: Silence & Rumble (Glowing Red Laser) */}
      {(stage === 'rumble' || stage === 'silence') && (
        <div
          ref={verticalLineRef}
          style={{
            position: 'absolute',
            width: '2px',
            height: '0px',
            backgroundColor: '#ff1f27',
            opacity: 0,
            borderRadius: '2px',
            boxShadow: '0 0 25px 5px #ff1f27, 0 0 50px 12px rgba(229,9,20,0.6)',
            zIndex: 10
          }}
        />
      )}

      {/* STAGE: Impact Logo Reveal */}
      {stage === 'impact' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Drifting smoke particles canvas */}
          <canvas
            ref={smokeCanvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 3
            }}
          />

          {/* Sweeping lens flare line */}
          <div
            ref={flareRef}
            style={{
              position: 'absolute',
              width: '100px',
              height: '100%',
              background: 'linear-gradient(to right, transparent, rgba(255, 31, 39, 0.4), rgba(255, 255, 255, 0.8), rgba(255, 31, 39, 0.4), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
              zIndex: 4,
              opacity: 0,
              filter: 'blur(10px)'
            }}
          />

          <h1
            ref={logoTextRef}
            className="shine-effect"
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: 'clamp(2rem, 7vw, 4.8rem)',
              fontWeight: 900,
              letterSpacing: '0.4em',
              color: 'var(--accent-red)',
              zIndex: 5,
              textShadow: '0 0 30px rgba(229, 9, 20, 0.8), 0 0 15px rgba(229, 9, 20, 0.3), 0 10px 45px rgba(0,0,0,0.95)',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}
          >
            {logoLetters.map((char, index) => (
              <span
                key={index}
                className="logo-letter"
                style={{
                  marginRight: char === ' ' ? '1.5rem' : '0.1rem'
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      )}

      {/* STAGE: Names Reveal */}
      {stage === 'reveal-names' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Gold dust particles canvas */}
          <canvas
            ref={dustCanvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 3
            }}
          />

          <div
            ref={nowStreamingRef}
            style={{
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              textAlign: 'center',
              padding: '0 20px',
              transform: 'scale(1.0)'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-outfit)',
                color: 'var(--accent-gold)',
                fontSize: 'clamp(0.85rem, 2vw, 1.15rem)',
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              NOW STREAMING
            </span>

            <span
              style={{
                fontFamily: 'var(--font-outfit)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: 'clamp(0.72rem, 1.5vw, 0.98rem)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 400
              }}
            >
              THE WEDDING OF
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: 'clamp(2.4rem, 8vw, 5.8rem)',
                fontWeight: 800,
                letterSpacing: '0.22em',
                lineHeight: 1.1,
                color: '#ffffff',
                textShadow: '0 10px 40px rgba(0,0,0,0.9), 0 0 15px rgba(255,255,255,0.1)'
              }}
            >
              AARAV <span style={{ color: 'var(--accent-gold)', fontSize: 'clamp(1.8rem, 6vw, 4.5rem)', fontWeight: 400 }}>&</span> SIYA
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                color: 'var(--text-gray)',
                fontSize: 'clamp(0.75rem, 1.8vw, 1.05rem)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginTop: '15px',
                fontWeight: 300
              }}
            >
              PREMIERING DECEMBER 18, 2026
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
