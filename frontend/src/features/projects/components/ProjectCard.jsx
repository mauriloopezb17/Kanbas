import React from 'react';

const ProjectCard = ({ color, name, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="w-full h-48 rounded-2xl overflow-hidden shadow-md cursor-pointer transform transition hover:scale-105"
    >
      <div 
        className="h-36 w-full" 
        style={{ backgroundColor: color }}
      ></div>
      <div className="h-12 bg-[#0097b2] flex items-center px-4">
        <span className="text-white font-medium text-lg truncate">{name}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
