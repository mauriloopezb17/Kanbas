import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const BoardColumn = ({ title, tasks, color, onAddTask, onEditTask, onDeleteTask, onCommentsTask, id, onAssignSelf, currentUser }) => {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const taskIds = useMemo(() => tasks.map(t => t.id.toString()), [tasks]);

  const handleToggleTask = (taskId) => {
    setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
  };
  
  const checkIsAssigned = (task) => {
      if (!currentUser) return false;
      // Verificamos por ID si es posible (mas seguro)
      const currentId = Number(currentUser.idUsuario || currentUser.id);
      if (currentId && task.members && task.members.some(m => Number(m.id) === currentId)) {
          return true;
      }
      
      const userName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
      return task.members.some(m => m.name === userName || m.name === currentUser.usuario);
  };

  return (
    <div 
      ref={setNodeRef}
      className="flex flex-col h-full rounded-3xl w-80 flex-shrink-0 border-2 p-4 transition-colors"
      style={{ 
        backgroundColor: `${color}33`, 
        borderColor: color 
      }}
    >
      <h2 className="text-3xl font-normal text-black mb-4 pl-2 font-sans text-center">{title}</h2>
      
      <div className="flex-1 overflow-y-auto px-2 pt-4 pb-4 scrollbar-hide space-y-4">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              color={color}
              isExpanded={expandedTaskId === task.id}
              onToggle={() => handleToggleTask(task.id)}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onComments={onCommentsTask}
              columnId={id}
              onAssignSelf={onAssignSelf}
              isAssigned={checkIsAssigned(task)}
            />
          ))}
        </SortableContext>
        
        {/* boton para agregar tarea (adentro de lo que se mueve) */}
        {renderAddTaskButton(title, onAddTask)}
      </div>
    </div>
  );
};

const renderAddTaskButton = (title, onAddTask) => {
    if (title === "To do" && onAddTask) {
        return (
            <button 
              onClick={onAddTask}
              className="w-full mt-2 py-3 rounded-full border-2 border-dashed border-kanbas-blue text-kanbas-blue font-bold flex items-center justify-center hover:bg-kanbas-blue/10 transition bg-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Tarea
            </button>
        );
    }
    return null;
};

export default BoardColumn;
