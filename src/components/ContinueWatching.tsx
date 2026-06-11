import { useState } from 'react';
import { Play, Info } from 'lucide-react';

interface MemoryCard {
  id: number;
  title: string;
  category: string;
  progress: number; // percentage
  image: string;
  runtimeLeft: string;
}

export default function ContinueWatching() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const memories: MemoryCard[] = [
    {
      id: 1,
      title: 'Travel Diaries: Ladakh Escapade',
      category: 'Romantic Travel Vlog',
      progress: 72,
      image: '/Couple-Photoshoot-in-kotagiri-7-1024x683.jpg',
      runtimeLeft: '12m left'
    },
    {
      id: 2,
      title: 'The Ring Shopping Secret',
      category: 'Proposal Backstory',
      progress: 90,
      image: '/images (1).jpg',
      runtimeLeft: '3m left'
    },
    {
      id: 3,
      title: 'Behind the Scenes: Sangeet Rehearsals',
      category: 'Dance Bloopers',
      progress: 42,
      image: '/images (2).jpg',
      runtimeLeft: '22m left'
    },
    {
      id: 4,
      title: 'A & R: The Childhood Archives',
      category: 'Nostalgic Flashback',
      progress: 60,
      image: '/images.jpg',
      runtimeLeft: '15m left'
    }
  ];

  return (
    <section
      style={{
        padding: '20px clamp(20px, 6vw, 80px) 60px clamp(20px, 6vw, 80px)',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        zIndex: 5
      }}
    >
      <div style={{ marginBottom: '30px' }}>
        <h2
          className="luxury-heading"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            fontWeight: 700,
            letterSpacing: '0.12em'
          }}
        >
          Continue Watching for Guest
        </h2>
        <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--accent-red)', marginTop: '8px' }} />
      </div>

      {/* Grid / Horizontal Row */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '10px 0 20px 0'
        }}
      >
        {memories.map((mem) => {
          const isHovered = hoveredId === mem.id;
          return (
            <div
              key={mem.id}
              onMouseEnter={() => setHoveredId(mem.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                flex: '0 0 280px',
                position: 'relative',
                height: '200px',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.8), 0 0 10px rgba(229, 9, 20, 0.15)' : '0 6px 15px rgba(0,0,0,0.5)'
              }}
            >
              {/* Thumbnail Image */}
              <div style={{ width: '100%', height: '155px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={mem.image}
                  alt={mem.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isHovered ? 'brightness(0.85)' : 'brightness(0.65)',
                    transition: 'filter 0.3s ease'
                  }}
                />

                {/* Info & Play Overlays on Hover */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        background: '#ffffff',
                        color: 'var(--bg-primary)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <Play size={16} fill="var(--bg-primary)" style={{ marginLeft: '1px' }} />
                    </div>
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: '#ffffff',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <Info size={16} />
                    </div>
                  </div>
                )}

                {/* Subtext info inside image bottom */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    fontSize: '0.65rem',
                    color: '#fff',
                    fontWeight: 500
                  }}
                >
                  {mem.runtimeLeft}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div style={{ position: 'relative', width: '100%', height: '4px', backgroundColor: '#404040' }}>
                <div
                  className="netflix-progress"
                  style={{
                    width: `${mem.progress}%`
                  }}
                />
              </div>

              {/* Details (Row bottom) */}
              <div
                style={{
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 'calc(100% - 159px)'
                }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '90%' }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {mem.title}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-gray)' }}>
                    {mem.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
