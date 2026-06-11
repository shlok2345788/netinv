import React from 'react';
import { MapPin, Compass, Navigation, Calendar, CheckSquare } from 'lucide-react';

export default function VenueDetails() {
  const handleAddToCalendar = () => {
    // Generate simple calendar info alert
    alert("This event has been prepared for your schedule: Aarav & Siya's Grand Wedding Premiere starting Dec 17, 2026, Jodhpur. A calendar invite link will be emailed to you after RSVP confirmation!");
  };

  return (
    <section
      id="venue"
      style={{
        padding: '60px clamp(20px, 6vw, 80px) 60px clamp(20px, 6vw, 80px)',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Title */}
      <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '45px', textAlign: 'left' }}>
        <h2
          className="luxury-heading"
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            fontWeight: 700,
            letterSpacing: '0.15em'
          }}
        >
          PREMIERE LOCATION
        </h2>
        <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--accent-red)', marginTop: '8px' }} />
      </div>

      {/* Main Premium Card */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid rgba(197, 160, 89, 0.2)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(139, 16, 20, 0.15)'
        }}
      >
        {/* Left column: Visuals / Maps preview frame */}
        <div
          style={{
            position: 'relative',
            minHeight: '350px',
            backgroundImage: `url('/Couple-Photoshoot-in-kotagiri-7-1024x683.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '40px'
          }}
        >
          {/* Dark overlay for text readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)',
              zIndex: 1
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.2em', fontWeight: 600, textTransform: 'uppercase' }}>
              THE VENUE
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.05em'
              }}
            >
              Umaid Bhawan Palace
            </h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-gray)' }}>
              <MapPin size={14} style={{ color: 'var(--accent-red)' }} /> Jodhpur, Rajasthan, India - 342006
            </p>
          </div>
        </div>

        {/* Right column: Content Details */}
        <div
          style={{
            padding: 'clamp(24px, 5vw, 45px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '30px'
          }}
        >
          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em' }}>
              <Compass size={18} />
              <span>DIRECTIONS & SCHEDULE</span>
            </div>

            <p style={{ color: 'var(--text-gray)', fontSize: '0.92rem', lineHeight: '1.7', fontWeight: 300 }}>
              Perched on Chittar Hill, the highest point in Jodhpur, the magnificent **Umaid Bhawan Palace** serves as the regal setting for our grand premiere. Built with golden-yellow sandstone, it is one of the world's largest private residences and features exquisite Art Deco heritage design.
            </p>

            <p style={{ color: 'var(--text-gray)', fontSize: '0.92rem', lineHeight: '1.7', fontWeight: 300 }}>
              Complimentary royal hospitality, suites, and local luxury transport are arranged for our VIP guests from **December 16th to December 19th**.
            </p>
          </div>

          {/* Quick Schedule summary list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderLeft: '2px solid var(--accent-red-deep)',
              paddingLeft: '16px',
              margin: '10px 0'
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.05em' }}>DECEMBER 17 — ARRIVALS & COCKTAILS</p>
              <p style={{ fontSize: '0.85rem', color: '#fff' }}>Welcome Lunch (12:30 PM) & Royal Sangeet Choirs (7:30 PM)</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.05em' }}>DECEMBER 18 — THE GRAND WEDDING</p>
              <p style={{ fontSize: '0.85rem', color: '#fff' }}>Baraat Assembly (3:30 PM) & Wedding Ceremony (4:30 PM)</p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <a
              href="https://maps.google.com/?q=Umaid+Bhawan+Palace+Jodhpur"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cinema btn-primary-red"
              style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '12px 24px' }}
            >
              <Navigation size={16} />
              Navigate Location
            </a>

            <button
              onClick={handleAddToCalendar}
              className="btn-cinema btn-secondary-gold"
              style={{ fontSize: '0.85rem', padding: '12px 24px' }}
            >
              <Calendar size={16} />
              Add to Schedule
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
