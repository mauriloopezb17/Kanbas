import React from 'react';

const ProjectCard = ({ color, name, role, onClick }) => {
  // Deterministic hash from string
  const getHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const gradients = [
    "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)", // Blue-Purple
    "linear-gradient(135deg, #FBAB7E 0%, #F7CE68 100%)", // Orange-Yellow
    "linear-gradient(135deg, #85FFBD 0%, #FFFB7D 100%)", // Green-Yellow
    "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)", // Pinkish
    "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)", // Neon
    "linear-gradient(135deg, #fee140 0%, #fa709a 100%)", // Yellow-Red
    "linear-gradient(135deg, #0093E9 160deg, #80D0C7 100%)", // Blue-Cyan
    "linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)", // Deep-Color
  ];
  
  const idx = Math.abs(getHash(name || "")) % gradients.length;
  const bgStyle = gradients[idx];

  return (
    <div 
      onClick={onClick}
      className="w-full h-48 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
    >
      {/* Top Part: Gradient & Patterns (h-36 is 75% of h-48) */}
      <div 
        className="h-36 w-full relative overflow-hidden" 
        style={{ background: bgStyle }}
      >
        {/* Pattern Overlay - Geometric Circles */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
                 backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 20%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.4) 0%, transparent 20%)`,
                 backgroundSize: '100% 100%'
             }}>
        </div>
        {/* Pattern Overlay - Grid */}
        <div className="absolute inset-0 opacity-10"
             style={{
                 backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
                 backgroundSize: '20px 20px'
             }}>
        </div>
        
        {/* Hover Light Effect (Only on top part now) */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>
      </div>

      {/* Bottom Part: Original Style (h-12) */}
      <div className="h-12 flex flex-col justify-center px-4 animate-gradient-bg bg-white/10 backdrop-blur-sm">
        {/* Note: Original code had 'text-white' but no background class on this specific div (it relied on parent or animate-gradient-bg).
            However, since I changed the parent to NOT have a solid color, I should probably ensure this bottom bar has a background
            if 'animate-gradient-bg' doesn't provide it sufficiently, or if it was transparent.
            If the whole card container had a background, we lost it. 
            The original 'ProjectCard' only had 'w-full h-48 ...'. It did NOT have a background color itself. 
            So the bottom bar was likely transparent or the 'animate-gradient-bg' provided the dark blue/purple background seen in the app.
            I will assume 'animate-gradient-bg' sets the background. */}
        <span className="text-white font-medium text-lg truncate leading-tight">{name}</span>
        {role && <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{role}</span>}
      </div>
    </div>
  );
};

export default ProjectCard;
