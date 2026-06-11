import { useState } from 'react';
import { User, Plus, Check, Ticket, ArrowLeft, Users, Mail, Clipboard, Sparkles } from 'lucide-react';

export default function RSVPPremier() {
  const [stage, setStage] = useState<'profiles' | 'form' | 'ticket'>('profiles'); // profiles, form, ticket
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    status: 'attending', // attending, declining
    meal: 'vegetarian',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [messageAlert, setMessageAlert] = useState<string | null>(null);

  const handleProfileClick = (profile: string) => {
    setSelectedProfile(profile);
    if (profile === 'guest') {
      setStage('form');
    } else if (profile === 'groom') {
      setMessageAlert("AARAV (Groom): \"So glad you're here! I'm busy memorizing my vows, but make sure to click 'Guest' to reserve your ticket. See you in Jodhpur!\"");
      setTimeout(() => setMessageAlert(null), 6000);
    } else if (profile === 'bride') {
      setMessageAlert("SIYA (Bride): \"Welcome! We're putting together the final cuts of our trailer. Choose the 'Guest' profile to lock in your premiere reservation!\"");
      setTimeout(() => setMessageAlert(null), 6000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required to issue a ticket';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Smooth transition to ticket reveal
    setStage('ticket');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="rsvp"
      style={{
        padding: '80px clamp(20px, 6vw, 80px) 100px clamp(20px, 6vw, 80px)',
        backgroundColor: '#050505',
        position: 'relative',
        zIndex: 5,
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Alert Banner for Groom/Bride messages */}
      {messageAlert && (
        <div
          style={{
            position: 'fixed',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid var(--accent-gold)',
            color: '#fff',
            padding: '18px 30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px var(--accent-gold-glow)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeInSlideDown 0.4s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>
            <Sparkles size={16} />
            <span>DIRECTOR COMMONLY ASKED</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', fontFamily: 'var(--font-outfit)', fontWeight: 300 }}>
            {messageAlert}
          </p>
        </div>
      )}
      <style>{`
        @keyframes fadeInSlideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      {/* STAGE 1: Who's Watching (Profile Selector) */}
      {stage === 'profiles' && (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: '#fff',
              margin: 0
            }}
          >
            Who's Watching?
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '30px',
              maxWidth: '800px'
            }}
          >
            {/* Groom Profile */}
            <div
              onClick={() => handleProfileClick('groom')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 'clamp(100px, 15vw, 130px)',
                  height: 'clamp(100px, 15vw, 130px)',
                  borderRadius: '4px',
                  backgroundColor: '#8b1014',
                  backgroundImage: `linear-gradient(135deg, #8b1014 0%, #1a1a1a 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid transparent',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = 'var(--accent-red)';
                  e.currentTarget.style.boxShadow = '0 0 20px var(--accent-red-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
                }}
              >
                <User size={60} style={{ color: '#fff', opacity: 0.8 }} />
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)', fontWeight: 500 }}>Aarav (Groom)</span>
            </div>

            {/* Bride Profile */}
            <div
              onClick={() => handleProfileClick('bride')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 'clamp(100px, 15vw, 130px)',
                  height: 'clamp(100px, 15vw, 130px)',
                  borderRadius: '4px',
                  backgroundColor: '#c5a059',
                  backgroundImage: `linear-gradient(135deg, #c5a059 0%, #1a1a1a 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid transparent',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  e.currentTarget.style.boxShadow = '0 0 20px var(--accent-gold-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
                }}
              >
                <User size={60} style={{ color: '#fff', opacity: 0.8 }} />
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)', fontWeight: 500 }}>Siya (Bride)</span>
            </div>

            {/* Guest Add Profile */}
            <div
              onClick={() => handleProfileClick('guest')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 'clamp(100px, 15vw, 130px)',
                  height: 'clamp(100px, 15vw, 130px)',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                }}
              >
                <Plus size={36} style={{ color: 'var(--text-gray)', opacity: 0.8 }} />
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)', fontWeight: 500 }}>Guest (RSVP)</span>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginTop: '20px', fontFamily: 'var(--font-outfit)' }}>
            Select "Guest" to register your presence for the grand theater premiere.
          </p>
        </div>
      )}

      {/* STAGE 2: RSVP Form */}
      {stage === 'form' && (
        <div
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: '550px',
            padding: 'clamp(20px, 5vw, 40px)',
            borderRadius: '8px',
            border: '1px solid rgba(197, 160, 89, 0.2)',
            position: 'relative'
          }}
        >
          {/* Back button */}
          <button
            onClick={() => setStage('profiles')}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'none',
              border: 'none',
              color: 'var(--text-gray)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
            <h3 className="luxury-heading" style={{ fontSize: '1.4rem', letterSpacing: '0.1em' }}>
              JOIN THE PREMIERE
            </h3>
            <p style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', letterSpacing: '0.1em', marginTop: '5px' }}>
              RESERVE YOUR VIP ADMISSION PASS
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                FULL NAME
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-outfit)'
                  }}
                />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(255,255,255,0.4)' }} />
              </div>
              {formErrors.name && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email to receive ticket"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-outfit)'
                  }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(255,255,255,0.4)' }} />
              </div>
              {formErrors.email && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.email}</span>}
            </div>

            {/* Form grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {/* RSVP Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                  ATTENDANCE
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'var(--font-outfit)'
                  }}
                >
                  <option value="attending">Attending Premiere</option>
                  <option value="declined">Watching from Afar</option>
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                  VIP SEATS
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 35px',
                      backgroundColor: 'rgba(10, 10, 10, 0.8)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontFamily: 'var(--font-outfit)'
                    }}
                  >
                    <option value="1">1 Seat</option>
                    <option value="2">2 Seats</option>
                    <option value="3">3 Seats</option>
                    <option value="4">4 Seats</option>
                    <option value="5">5 Seats</option>
                  </select>
                  <Users size={14} style={{ position: 'absolute', left: '12px', top: '16px', color: 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>
            </div>

            {/* Meal Choice */}
            {formData.status === 'attending' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                  MEAL PREFERENCE
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    name="meal"
                    value={formData.meal}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 35px',
                      backgroundColor: 'rgba(10, 10, 10, 0.8)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontFamily: 'var(--font-outfit)'
                    }}
                  >
                    <option value="vegetarian">Vegetarian Feast</option>
                    <option value="non-vegetarian">Non-Vegetarian Heritage Cuisine</option>
                    <option value="vegan">Vegan / Organic</option>
                    <option value="jain">Jain Culinary Board</option>
                  </select>
                  <Clipboard size={14} style={{ position: 'absolute', left: '12px', top: '16px', color: 'rgba(255,255,255,0.4)' }} />
                </div>
              </div>
            )}

            {/* Note to couple */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent-gold)', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                MESSAGE FOR CAST & CREW
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                placeholder="Send your blessings or notes to Aarav & Siya..."
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'rgba(10, 10, 10, 0.8)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontFamily: 'var(--font-outfit)',
                  resize: 'none'
                }}
              />
            </div>

            {/* Submit button */}
            <button type="submit" className="btn-cinema btn-primary-red" style={{ padding: '14px', justifyContent: 'center' }}>
              Confirm Premiere Invitation
            </button>
          </form>
        </div>
      )}

      {/* STAGE 3: Ticket Success State */}
      {stage === 'ticket' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%' }}>
          
          {/* Invitation Confirmation Header */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(70, 211, 105, 0.15)',
                color: '#46d369',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto',
                border: '1px solid #46d369',
                boxShadow: '0 0 15px rgba(70, 211, 105, 0.2)'
              }}
            >
              <Check size={30} />
            </div>
            <h3 className="luxury-heading" style={{ fontSize: '1.4rem' }}>Reservation Confirmed</h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', marginTop: '5px' }}>
              Your cinematic passes have been registered. Print or save this ticket.
            </p>
          </div>

          {/* Golden VIP Movie Ticket Mockup */}
          <div
            id="vip-ticket"
            style={{
              width: '100%',
              maxWidth: '650px',
              background: 'linear-gradient(135deg, #151515 0%, #0c0c0c 100%)',
              border: '2px solid var(--accent-gold)',
              borderRadius: '12px',
              padding: '0',
              overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 35px var(--accent-gold-glow)',
              position: 'relative'
            }}
          >
            {/* Gold Corner Ornaments */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderTop: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)' }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '20px', height: '20px', borderBottom: '2px solid var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid var(--accent-gold)', borderRight: '2px solid var(--accent-gold)' }} />

            {/* Ticket Header */}
            <div
              style={{
                borderBottom: '1px dashed rgba(197, 160, 89, 0.3)',
                padding: '30px 40px 20px 40px',
                textAlign: 'center',
                backgroundColor: 'rgba(139, 16, 20, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.75rem', letterSpacing: '0.35em', fontWeight: 600 }}>
                <Ticket size={16} />
                <span>ARIYA DIARY ORIGINAL SPECIAL PREMIERE</span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  marginTop: '10px'
                }}
              >
                AARAV <span style={{ color: 'var(--accent-gold)' }}>&</span> SIYA
              </h1>
            </div>

            {/* Ticket Details Body */}
            <div
              style={{
                padding: '30px 40px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px'
              }}
            >
              {/* Left Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>VIP GUEST PASS</p>
                  <p style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600 }}>{formData.name || 'Honorable Guest'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>ADMISSION STATUS</p>
                  <p style={{ fontSize: '1rem', color: '#fff', fontWeight: 500, textTransform: 'uppercase' }}>
                    {formData.status === 'attending' 
                      ? `ADMIT ${formData.guests} (Attending)` 
                      : 'Watching From Afar'
                    }
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>MEAL BOARDING</p>
                  <p style={{ fontSize: '0.9rem', color: '#fff', textTransform: 'capitalize' }}>
                    {formData.status === 'attending' ? `${formData.meal} menu` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Right Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>THE VENUE SET</p>
                  <p style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 500 }}>Umaid Bhawan Palace, Jodhpur</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>PREMIERE DATE</p>
                  <p style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 500 }}>December 17 - 18, 2026</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>SEATING SECTION</p>
                  <p style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>
                    {formData.status === 'attending' ? `Row A, VIP Seats 18-${18 + parseInt(formData.guests) - 1}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Footer / Barcode */}
            <div
              style={{
                borderTop: '1px dashed rgba(197, 160, 89, 0.3)',
                padding: '25px 40px',
                textAlign: 'center',
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {/* CSS Barcode */}
              <div
                style={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  opacity: 0.8
                }}
              >
                {/* Simulated Barcode bars */}
                {[2, 4, 1, 3, 1, 4, 2, 1, 3, 2, 4, 1, 1, 3, 2, 4, 1, 3, 2, 1, 4, 3, 1, 2, 4, 1, 3, 2].map((w, idx) => (
                  <div key={idx} style={{ width: `${w}px`, height: '32px', backgroundColor: 'var(--accent-gold)' }} />
                ))}
              </div>
              <p
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.4em',
                  color: 'var(--accent-gold)',
                  margin: 0
                }}
              >
                * ARIYA-20261218-{formData.name.toUpperCase().substring(0,3) || 'GST'} *
              </p>
            </div>
          </div>

          {/* Ticket actions */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handlePrint}
              className="btn-cinema btn-primary-red"
            >
              Print / Save Ticket
            </button>
            <button
              onClick={() => {
                setStage('profiles');
                setFormData({
                  name: '',
                  email: '',
                  guests: '1',
                  status: 'attending',
                  meal: 'vegetarian',
                  message: ''
                });
              }}
              className="btn-cinema btn-secondary-dark"
            >
              Issue Another Ticket
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
