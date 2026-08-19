import React from 'react';

const Logo = ({ isDark = false, scale = 1, className = '' }) => {
  return (
    <div className={`d-flex align-items-center ${className}`} style={{ gap: `${12 * scale}px` }}>
      <div 
        className="d-flex align-items-center justify-content-center"
        style={{
          width: `${60 * scale}px`,
          height: `${60 * scale}px`,
          background: 'linear-gradient(135deg, #ff0033 0%, #b30000 100%)',
          borderRadius: `${14 * scale}px`,
          color: 'white',
          boxShadow: '0 8px 20px rgba(230, 0, 35, 0.4)',
          transform: 'rotate(-5deg)'
        }}
      >
        <i className="fas fa-car-side" style={{ fontSize: `${32 * scale}px`, transform: 'rotate(5deg)' }}></i>
      </div>
      <h1 
        className="m-0" 
        style={{ 
          fontSize: `${2.4 * scale}rem`, 
          fontWeight: '900',
          letterSpacing: '-1px',
          color: isDark ? '#ffffff' : '#222222',
        }}
      >
        Car<span style={{ color: '#e60023' }}>Verse</span>
      </h1>
    </div>
  );
};

export default Logo;
