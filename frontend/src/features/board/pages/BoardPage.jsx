import React, { useState, useRef } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import BoardColumn from '../components/BoardColumn';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../../tasks/components/CreateTaskModal';
import DeleteTaskModal from '../../tasks/components/DeleteTaskModal';
import AssignTaskModal from '../../tasks/components/AssignTaskModal';
import TaskCommentsModal from '../../tasks/components/TaskCommentsModal';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  MeasuringStrategy
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

const BoardPage = ({ project, onBack }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  
  // cosas de los comentarios
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [commentingTask, setCommentingTask] = useState(null);
  
  // mover cosas y asignar gente
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState(null); // { taskId, sourceContainer, targetContainer, overIndex }

  // datos de mentira
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: 'Tarea 1', description: 'Descripcion de ejemplo Descripcion de ejemplo', members: [] },
      { id: 2, title: 'Tarea 2', description: 'Descripcion de ejemplo Descripcion de ejemplo', members: [] },
      { id: 3, title: 'Tarea 3', description: 'Descripcion de ejemplo Descripcion de ejemplo Descripcion de ejemplo Descripcion de ejemplo', members: [] },
    ],
    inProgress: [
      { id: 4, title: 'Tarea 4', description: 'En progreso...', members: [] },
      { id: 5, title: 'Tarea 5', description: 'En progreso...', members: [{name: 'Jose Cortez'}] },
      { id: 6, title: 'Tarea 6', description: 'En progreso...', members: [] },
    ],
    review: [
      { id: 7, title: 'Tarea 1', description: 'Revision...', members: [] },
      { id: 8, title: 'Tarea 2', description: 'Revision...', members: [] },
      { id: 9, title: 'Tarea 3', description: 'Revision...', members: [] },
    ],
    done: [
      { id: 10, title: 'Tarea 4', description: 'Hecho...', members: [] },
      { id: 11, title: 'Tarea 5', description: 'Hecho...', members: [] },
      { id: 12, title: 'Tarea 6', description: 'Hecho...', members: [] },
    ]
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id) => {
    if (id in tasks) return id;
    return Object.keys(tasks).find((key) => tasks[key].find((t) => t.id.toString() === id.toString()));
  };

  /* 
   * cosas para mover las tarjetas 
   */
  const dragStartContainerRef = React.useRef(null);
  
  const handleDragStart = (event) => {
    const { active } = event;
    const container = findContainer(active.id);
    dragStartContainerRef.current = container;
    setActiveId(active.id);
    
    // busca la tarea para que flote bien bonita
    const task = Object.values(tasks).flat().find(t => t.id.toString() === active.id.toString());
    setActiveTask(task);
    
    console.log('[DnD] Drag Start:', { id: active.id, container });
  };
  
  const isValidTransition = (startContainer, overContainer) => {
      // 1. si es el mismo lugar todo bien
      if (startContainer === overContainer) return true;
      
      const validMoves = {
          'todo': ['inProgress'],
          'inProgress': ['review'],
          'review': ['inProgress', 'done'],
          'done': []
      };
      
      const allowedDestinations = validMoves[startContainer] || [];
      
      if (!allowedDestinations.includes(overContainer)) {
          console.warn(`[DnD Block] Invalid Move: ${startContainer} -> ${overContainer}`);
          return false;
      }
      
      return true;
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) return;

    const activeContainer = findContainer(active.id); // Current container (changes during drag)
    const overContainer = findContainer(overId);      // Target container
    const startContainer = dragStartContainerRef.current; // Origin container

    if (!activeContainer || !overContainer || !startContainer) return;
    
    // checar reglas para que no hagan cochinadas
    // (ej. no saltarse pasos ni ir pa tras)
    if (!isValidTransition(startContainer, overContainer)) {
        return; // Block visual movement/drop
    }

    // moviendo entre columnas
    if (activeContainer !== overContainer) {
      setTasks((prev) => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];
        const activeIndex = activeItems.findIndex((i) => i.id.toString() === active.id.toString());
        const overIndex = overItems.findIndex((i) => i.id.toString() === overId.toString());

        let newIndex;
        if (overId in prev) {
          // soltado en la nada
          newIndex = overItems.length + 1;
        } else {
          // soltado encima de otro
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;
          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        return {
          ...prev,
          [activeContainer]: [
            ...prev[activeContainer].filter((item) => item.id.toString() !== active.id.toString()),
          ],
          [overContainer]: [
            ...prev[overContainer].slice(0, newIndex),
            activeItems[activeIndex],
            ...prev[overContainer].slice(newIndex, prev[overContainer].length),
          ],
        };
      });
    } 
    // reordenar en la misma lista
    else {
       const activeIndex = tasks[activeContainer].findIndex((i) => i.id.toString() === active.id.toString());
       const overIndex = tasks[overContainer].findIndex((i) => i.id.toString() === overId.toString());
       
       if (activeIndex !== overIndex) {
         setTasks((prev) => ({
           ...prev,
           [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
         }));
       }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over ? over.id : null);
    const startContainer = dragStartContainerRef.current;
    
    console.log('[DnD] Drag End:', { 
        active: active.id, 
        over: over?.id, 
        start: startContainer, 
        end: activeContainer // Should be same as overContainer usually
    });

    // 1. checar si hay que asignar (Todo -> en progreso)
    if (
        startContainer === 'todo' && 
        (overContainer === 'inProgress' || activeContainer === 'inProgress')
    ) {
        // la tarea ya se movio
        // buscamos la tarea donde debe estar
        const task = tasks['inProgress'].find(t => t.id.toString() === active.id.toString());
        
        if (task) {
            const currentUser = "Jose Cortez";
            const isAssigned = task.members.some(m => m.name === currentUser);
            
            if (!isAssigned) {
                console.log('[DnD] Triggering Assignment Modal for:', task.title);
                setPendingAssignment({
                    taskId: task.id,
                    source: 'todo',
                    dest: 'inProgress',
                    task: task
                });
                setAssignModalOpen(true);
            }
        }
    }

    // limpiar el cochinero
    setActiveId(null);
    setActiveTask(null);
    dragStartContainerRef.current = null;
  };

  const handleConfirmAssignment = () => {
    // meter al usuario
    if (pendingAssignment) {
        const { task } = pendingAssignment;
        const updatedTask = { 
            ...task, 
            members: [...task.members, { name: "Jose Cortez" }] // usuario de mentira
        };
        
        // actualizar estado
        setTasks(prev => ({
            ...prev,
            inProgress: prev.inProgress.map(t => t.id === task.id ? updatedTask : t)
        }));
    }
    setAssignModalOpen(false);
    setPendingAssignment(null);
  };

  const handleCancelAssignment = () => {
    // deshacer el movimiento
    if (pendingAssignment) {
        const { task, source, dest } = pendingAssignment;
        
        setTasks(prev => {
             // checar si esta donde debe
             const isInDest = prev[dest].some(t => t.id === task.id);
             if (!isInDest) return prev; // Safety check

             // quitar de donde cayo
             const destList = prev[dest].filter(t => t.id !== task.id);
             // devolver a su casa (checar si ya estaba)
             const sourceList = prev[source].some(t => t.id === task.id) 
                ? prev[source] 
                : [...prev[source], task];
             
             return {
                 ...prev,
                 [source]: sourceList,
                 [dest]: destList
             };
        });
    }
    setAssignModalOpen(false);
    setPendingAssignment(null);
  };


  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = () => {
    const newTasks = { ...tasks };
    for (const column in newTasks) {
        newTasks[column] = newTasks[column].filter(t => t.id !== deletingTask.id);
    }
    setTasks(newTasks);
    setDeletingTask(null);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };
  
  const handleOpenComments = (task) => {
      setCommentingTask(task);
      setIsCommentsModalOpen(true);
  };
  
  const handleAddComment = (taskId, comment) => {
    const newTasks = { ...tasks };
    for (const column in newTasks) {
        newTasks[column] = newTasks[column].map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    comments: [...(t.comments || []), comment]
                };
            }
            return t;
        });
    }
    setTasks(newTasks);
    // revisar tarea local
    if (commentingTask && commentingTask.id === taskId) {
        setCommentingTask({
            ...commentingTask,
            comments: [...(commentingTask.comments || []), comment]
        });
    }
  };
  


  return (
    <MainLayout isBoardView={true} projectName={project?.name || "Proyecto Ejemplo"} onLogoClick={onBack}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
          <div className="flex h-[calc(100vh-8rem)] overflow-x-auto gap-8 px-4 pb-4 items-stretch justify-center">
            <BoardColumn 
              id="todo"
              title="To do" 
              tasks={tasks.todo} 
              color="#2563eb" 
              onAddTask={() => setIsTaskModalOpen(true)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onCommentsTask={handleOpenComments}
            />
            <BoardColumn 
                id="inProgress"
                title="In progress" 
                tasks={tasks.inProgress} 
                color="#ef4444" 
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onCommentsTask={handleOpenComments}
            />
            <BoardColumn 
                id="review"
                title="Review" 
                tasks={tasks.review} 
                color="#f97316" 
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onCommentsTask={handleOpenComments}
            />
            <BoardColumn 
                id="done"
                title="Done" 
                tasks={tasks.done} 
                color="#10b981" 
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onCommentsTask={handleOpenComments}
            />
          </div>
          
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
                <TaskCard task={activeTask} color="#64748b" isExpanded={false} isOverlay={true} /> 
             ) : null}
          </DragOverlay>
      </DndContext>

      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={handleCloseTaskModal} 
        taskToEdit={editingTask}
      />
      
      <DeleteTaskModal 
        isOpen={!!deletingTask} 
        onClose={() => setDeletingTask(null)} 
        onConfirm={handleConfirmDelete}
        taskName={deletingTask?.title}
      />

      <AssignTaskModal 
        isOpen={assignModalOpen}
        onClose={handleCancelAssignment}
        onConfirm={handleConfirmAssignment}
        taskName={pendingAssignment?.task.title}
      />
      
      <TaskCommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        task={commentingTask}
        onAddComment={handleAddComment}
      />
    </MainLayout>
  );
};

export default BoardPage;
