import React from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';

interface HeroBannerProps {
  onExplore: () => void;
  onManage: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore, onManage }) => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1 className="hero-title">
          All Your Web Apps <br /> In One Place
        </h1>
        <p className="hero-subtitle">
          Access, manage, and launch your security, network & monitoring tools — faster, simpler, smarter.
        </p>
        <div className="hero-actions">
          <button onClick={onExplore} className="btn-primary">
            <span>Explore Apps</span>
            <ArrowRight size={15} />
          </button>
          <button onClick={onManage} className="btn-secondary">
            <SlidersHorizontal size={14} />
            <span>Manage Apps</span>
          </button>
        </div>
      </div>

      <div className="hero-watermark">
        Build <br />
        <span style={{ fontSize: '32px', color: 'rgba(255,255,255,0.6)' }}>Manage</span> <br />
        Grow
      </div>
    </div>
  );
};
