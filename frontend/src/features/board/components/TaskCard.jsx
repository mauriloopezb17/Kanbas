import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskCard = (props) => {
  if (props.isOverlay) {
    return <TaskCardUI {...props} />;
  }
  return <SortableTaskCard {...props} />;
};

const SortableTaskCard = ({ task, isExpanded, onToggle, color, onEdit, onDelete, onComments, columnId, onAssignSelf }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString(), data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <MemoizedTaskCardUI
      task={task}
      isExpanded={isExpanded}
      onToggle={onToggle}
      color={color}
      onEdit={onEdit}
      onDelete={onDelete}
      onComments={onComments}
      setNodeRef={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
      columnId={columnId}
      onAssignSelf={onAssignSelf}
    />
  );
};

const TaskCardUI = ({ 
    task, 
    isExpanded, 
    onToggle, 
    color, 
    onEdit, 
    onDelete,
    onComments,
    isOverlay,
    setNodeRef,
    style,
    attributes,
    listeners,
    isDragging,
    columnId,
    onAssignSelf
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // estilo especial para cuando flota
  const finalStyle = isOverlay ? {                 
        backgroundColor: color 
  } : { 
        ...style, 
        backgroundColor: color 
  };
  
  const finalClassName = isOverlay 
      ? `relative w-full rounded-3xl p-4 mb-4 shadow-2xl ring-2 ring-kanbas-blue cursor-grabbing overflow-hidden bg-opacity-100 scale-105`
      : `relative w-full rounded-3xl p-4 mb-4 transition-[background-color,box-shadow,opacity] duration-300 ease-in-out cursor-grab active:cursor-grabbing overflow-hidden ${
        isExpanded ? 'bg-opacity-100 scale-100 shadow-lg ring-2 ring-white/20' : 'bg-opacity-90 hover:scale-[1.02] hover:bg-opacity-100'
      }`;
      
  const handleMouseEnter = () => {
      if (!isDragging && !isOverlay) setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
      if (!isDragging && !isOverlay) setIsHovered(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={finalStyle}
      {...attributes}
      {...listeners}
      className={finalClassName}
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* encabezado: titulo y boton */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-white font-bold text-lg font-sans leading-tight">
          {task.title}
        </h3>
        
        {/* accion: agregar/asignarse o nada */}
        {columnId === 'inProgress' && onAssignSelf && (
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAssignSelf(task);
                }}
                className={`text-white/80 hover:text-white transition-opacity duration-300 ${
                    (isHovered || isExpanded || isOverlay) && !isDragging ? 'opacity-100' : 'opacity-0'
                }`}
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
             </button>
        )}
      </div>

      {/* lo que se ve cuando la abres */}
      <div 
        className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
            isExpanded && !isOverlay ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-2 text-white/90 text-sm">
          <p className="mb-4 font-sans leading-relaxed">
            {task.description || "Sin descripción"}
          </p>

          <div className="flex justify-end space-x-3 mt-2 border-t border-white/20 pt-2">
            {/* icono comentario */}
            <button 
              onClick={(e) => { e.stopPropagation(); onComments && onComments(task); }}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            {/* icono editar */}
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            {/* icono borrar */}
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task); }}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
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

const MemoizedTaskCardUI = React.memo(TaskCardUI);

export default TaskCard;
