import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Shirt, Play } from 'lucide-react';

interface Episode {
  id: number;
  episodeNumber: string;
  title: string;
  date: string;
  time: string;
  location: string;
  dressCode: string;
  image: string;
  description: string;
  match: string;
}

export default function EpisodesTimeline() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

    const episodes: Episode[] = [
    {
      id: 1,
      episodeNumber: 'EPISODE 1',
      title: 'THE FIRST MEETING',
      date: 'May 14, 2022',
      time: '6:30 PM',
      location: 'The Coffee Lounge, Mumbai',
      dressCode: 'Casual & Comfortable',
      image: '/images.jpg',
      description: 'A quiet Saturday afternoon turned extraordinary. What was scheduled as a quick 30-minute coffee meet blossomed into a 5-hour conversation, marked by laughter and the beautiful realization that some souls just instantly align.',
      match: '98% Match'
    },
    {
      id: 2,
      episodeNumber: 'EPISODE 2',
      title: 'THE PROPOSAL',
      date: 'November 23, 2024',
      time: '7:00 PM',
      location: 'Private Cliffside, Goa',
      dressCode: 'Resort Chic',
      image: '/images (1).jpg',
      description: 'Under the pretense of a seaside dinner, Aarav led Siya to a candlelit pathway overlooking the ocean. With the stars as witnesses and the crashing waves playing our melody, the question was popped, and the journey to forever officially began.',
      match: '99% Match'
    },
    {
      id: 3,
      episodeNumber: 'EPISODE 3',
      title: 'THE SANGEET NIGHT',
      date: 'December 17, 2026',
      time: '7:30 PM onwards',
      location: 'The Courtyard, Umaid Bhawan Palace',
      dressCode: 'Royal Indo-Western / Glamorous Ethnic',
      image: '/images (2).jpg',
      description: 'An evening of music, stellar performances, and endless dancing. The couple and their families take to the stage for a grand musical show, celebrating their union with heavy beats, exquisite food, and pure celebratory energy.',
      match: '97% Match'
    },
    {
      id: 4,
      episodeNumber: 'FINAL EPISODE',
      title: 'THE WEDDING DAY',
      date: 'December 18, 2026',
      time: '4:00 PM onwards',
      location: 'The Baradari, Umaid Bhawan Palace, Jodhpur',
      dressCode: 'Royal Traditional / Formal Sherwani & Lehenga',
      image: '/Couple-Photoshoot-in-kotagiri-7-1024x683.jpg',
      description: 'The main event. Aarav and Siya take their vows under the sacred canopy of a royal mandap. Followed by a regal reception feast under the star-lit sky, as they officially premiere their lifelong partnership.',
      match: '100% Match'
    }
  ];

  return (
    <section
      id="episodes"
      style={{
        padding: '80px clamp(20px, 6vw, 80px) 40px clamp(20px, 6vw, 80px)',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        zIndex: 5
      }}
    >
      <div style={{ marginBottom: '40px' }}>
        <h2
          className="luxury-heading"
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          Episodes <span style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', letterSpacing: '0.1em', fontWeight: 500 }}>(The Timeline)</span>
        </h2>
        <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', marginTop: '8px' }} />
      </div>

      {/* Horizontal Scroll Layout */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          padding: '20px 0 60px 0',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {episodes.map((ep) => {
          const isHovered = hoveredId === ep.id;
          return (
            <div
              key={ep.id}
              onMouseEnter={() => setHoveredId(ep.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                flex: '0 0 350px',
                scrollSnapAlign: 'start',
                position: 'relative',
                height: '420px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: isHovered ? 'scale(1.04) translateY(-10px)' : 'scale(1) translateY(0)',
                boxShadow: isHovered 
                  ? '0 15px 35px rgba(229, 9, 20, 0.25), 0 0 10px rgba(197, 160, 89, 0.15)' 
                  : '0 10px 25px rgba(0,0,0,0.6)',
                borderColor: isHovered ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                zIndex: isHovered ? 20 : 10
              }}
            >
              {/* Card Thumbnail Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={ep.image}
                  alt={ep.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isHovered ? 'brightness(0.9) contrast(1.05)' : 'brightness(0.7)',
                    transition: 'filter 0.4s ease'
                  }}
                />
                
                {/* Duration/Label tag over image */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(10, 10, 10, 0.8)',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--accent-gold)',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    letterSpacing: '0.1em'
                  }}
                >
                  {ep.episodeNumber}
                </div>

                {/* Match indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    color: '#46d369',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                  }}
                >
                  {ep.match}
                </div>

                {/* Hover Play Icon overlay */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(229, 9, 20, 0.95)',
                        color: '#fff',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(229, 9, 20, 0.6)'
                      }}
                    >
                      <Play size={18} fill="#fff" style={{ marginLeft: '2px' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Metadata & Summary */}
              <div
                style={{
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  height: 'calc(100% - 180px)',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-cinzel)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      color: '#fff',
                      marginBottom: '8px'
                    }}
                  >
                    {ep.title}
                  </h3>

                  {/* Summary */}
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-gray)',
                      lineHeight: '1.5',
                      fontWeight: 300,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '10px'
                    }}
                  >
                    {ep.description}
                  </p>
                </div>

                {/* Event Details Grid */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--text-gray)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={12} style={{ color: 'var(--accent-gold)' }} />
                    <span style={{ color: '#fff', fontWeight: 500 }}>{ep.date}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                    <Clock size={12} style={{ color: 'var(--accent-gold)' }} />
                    <span>{ep.time}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <MapPin size={12} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                    <span title={ep.location}>{ep.location}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Shirt size={12} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
                    <span title={ep.dressCode}>Dress: <span style={{ color: '#fff' }}>{ep.dressCode}</span></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
