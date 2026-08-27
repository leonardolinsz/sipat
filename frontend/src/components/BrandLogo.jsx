import React from 'react';

const LOGO_SRC = '/assets/cipaa-logo.jpeg';

export default function BrandLogo({ className = '' }) {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src={LOGO_SRC}
      alt="Logo da CIPAA"
      onError={event => { event.currentTarget.hidden = true; }}
    />
  );
}
