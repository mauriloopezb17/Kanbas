import React from 'react';

const ProjectCard = ({ color, name, role, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="w-full h-48 rounded-2xl overflow-hidden shadow-md cursor-pointer transform transition hover:scale-105"
    >
      <div 
        className="h-36 w-full" 
        style={{ backgroundColor: color }}
      ></div>
      <div className="h-12 flex flex-col justify-center px-4 animate-gradient-bg">
        <span className="text-white font-medium text-lg truncate leading-tight">{name}</span>
        {role && <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{role}</span>}
      </div>
    </div>
  );
};

export default ProjectCard;
