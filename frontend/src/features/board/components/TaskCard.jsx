import React, { useState } from 'react';

const TaskCard = ({ task, isExpanded, onToggle, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full rounded-3xl p-4 mb-4 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden ${
        isExpanded ? 'bg-opacity-100 scale-100 shadow-lg ring-2 ring-white/20' : 'bg-opacity-90 hover:scale-[1.02] hover:bg-opacity-100'
      }`}
      style={{ backgroundColor: color }}
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: Title + Toggle Icon */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-white font-bold text-lg font-sans leading-tight">
          {task.title}
        </h3>
        
        {/* Menu Icon */}
        <div 
            className={`text-white/80 hover:text-white transition-opacity duration-300 ${
                isHovered || isExpanded ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </div>
      </div>

      {/* Expanded Content with Smooth Transition */}
      <div 
        className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-2 text-white/90 text-sm">
          <p className="mb-4 font-sans leading-relaxed">
            {task.description || "Sin descripción"}
          </p>

          <div className="flex justify-end space-x-3 mt-2 border-t border-white/20 pt-2">
            {/* Comment Icon */}
            <button className="p-1 hover:bg-white/20 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            {/* Edit Icon */}
            <button className="p-1 hover:bg-white/20 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            {/* Delete Icon */}
            <button className="p-1 hover:bg-white/20 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
