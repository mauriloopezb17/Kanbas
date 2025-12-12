import React, { useState, useRef } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import BoardColumn from '../components/BoardColumn';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../../tasks/components/CreateTaskModal';
import DeleteTaskModal from '../../tasks/components/DeleteTaskModal';
import AssignTaskModal from '../../tasks/components/AssignTaskModal';
import TaskCommentsModal from '../../tasks/components/TaskCommentsModal';
import TaskTransitionModal from '../../tasks/components/TaskTransitionModal';
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

import { getTasksByProject, deleteTask, autoAssignTask } from '../../tasks/services/tasksService';

const BoardPage = ({ project, user, onBack, onLogout }) => {
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

  // transiciones de tareas (submit, approve, reject)
  const [transitionModal, setTransitionModal] = useState({
      isOpen: false,
      type: null, // 'SUBMIT', 'REJECT', 'APPROVE'
      pendingTransition: null // { taskId, source, dest, task }
  });

  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: []
  });

  /*
   * PERMISSIONS SYSTEM
   */
  const userRole = React.useMemo(() => {
     if (!user || !project) return 'TEAM_MEMBER';
     if (project.idSRM === user.idUsuario) return 'SRM';
     if (project.idPO === user.idUsuario) return 'PO';
     if (project.idSDM === user.idUsuario) return 'SDM';
     return 'TEAM_MEMBER';
  }, [user, project]);

  const isSuperUser = user?.idUsuario === 3 || user?.email === 'alejandro.a.bobarin.marquez@gmail.com';

  const permissions = React.useMemo(() => {
      // Superuser override
      if (isSuperUser) {
          return {
              canAdd: true,
              canEdit: true,
              canDelete: true,
              canAssignSelf: true,
              canReview: true,
              canMoveTodoInProgress: true,
              canMoveInProgressReview: true,
              canMoveReviewDone: true,
              canMoveBack: true,
              canGenerateReport: true
          };
      }

      const isSRM = userRole === 'SRM';
      const isPO = userRole === 'PO';
      const isSDM = userRole === 'SDM';
      const isTeamMember = userRole === 'TEAM_MEMBER';
      // Reviewers are usually PO, SDM, SRM
      const isReviewer = isSRM || isPO || isSDM;

      return {
          canAdd: isSRM,
          canEdit: isSRM,
          canDelete: isSRM,
          
          // Generar reporte -> PO y SDM
          canGenerateReport: isPO || isSDM,

          // Asignarse a sí mismo (drag from todo or click assign) -> Team Member
          canAssignSelf: isTeamMember,
          
          // Mover de InProgress a Review -> Team Member
          canMoveInProgressReview: isTeamMember,
          
          // Mover de Todo a InProgress -> Team Member
          canMoveTodoInProgress: isTeamMember,

          // Mover Review -> Done (Aprobar) o Review -> InProgress (Rechazar)
          canMoveReviewDone: isReviewer,
          canMoveBack: isReviewer, // De review a in progress
      };
  }, [userRole, isSuperUser]);

  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchTasks = async () => {
      if (!project?.id && !project?.idProyecto) return;
      try {
        setLoading(true);
        const projectId = project.id || project.idProyecto;
        const data = await getTasksByProject(projectId);
        // Backend devuelve { todo: [], inProgress: [], ... }
        // Asegurar que mapeamos correctamete los miembros/asignados si vienen diferentes
        // Backend usa "asignados" array, Frontend usa "members" en mocks.
        // Vamos a normalizar keys si es necesario.
        
        // Helper para normalizar tarea
        const normalizeTask = (t) => ({
             id: t.idTarea || t.id,
             title: t.titulo || t.title,
             description: t.descripcion || t.description,
             members: (t.asignados || []).map(a => ({ name: a.nombreUsuario || a.name || "Usuario" })),
             ...t
        });

        const normalizedData = {
            todo: (data.todo || []).map(normalizeTask),
            inProgress: (data.inProgress || []).map(normalizeTask),
            review: (data.review || []).map(normalizeTask),
            done: (data.done || []).map(normalizeTask),
        };

        setTasks(normalizedData);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project]);

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

      // Reglas de negocio (RBAC)
      if (startContainer === 'todo' && overContainer === 'inProgress') {
          return permissions.canMoveTodoInProgress;
      }
      if (startContainer === 'inProgress' && overContainer === 'review') {
          return permissions.canMoveInProgressReview;
      }
      if (startContainer === 'review' && (overContainer === 'done' || overContainer === 'inProgress')) {
          // Review -> Done (Aprobar)
          // Review -> InProgress (Rechazar)
          return permissions.canMoveReviewDone || permissions.canMoveBack;
      }
      
      // Si llegamos aqui, es un movimiento no contemplado explicitamente en las reglas,
      // por lo que asumimos que no esta permitido (ej: Done -> Todo).
      return false;
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

    // 1. Asignar (Todo -> In Progress)
    if (
        startContainer === 'todo' && 
        (overContainer === 'inProgress' || activeContainer === 'inProgress')
    ) {
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

    // 2. Entregar (In Progress -> Review) -> SUBMIT
    if (
        startContainer === 'inProgress' &&
        (overContainer === 'review' || activeContainer === 'review')
    ) {
        const task = tasks['review'].find(t => t.id.toString() === active.id.toString());
        if (task) {
            setTransitionModal({
                isOpen: true,
                type: 'SUBMIT',
                pendingTransition: {
                    taskId: task.id,
                    source: 'inProgress',
                    dest: 'review',
                    task: task
                }
            });
        }
    }

    // 3. Rechazar (Review -> In Progress) -> REJECT
    if (
        startContainer === 'review' &&
        (overContainer === 'inProgress' || activeContainer === 'inProgress')
    ) {
        const task = tasks['inProgress'].find(t => t.id.toString() === active.id.toString());
        if (task) {
            setTransitionModal({
                isOpen: true,
                type: 'REJECT',
                pendingTransition: {
                    taskId: task.id,
                    source: 'review',
                    dest: 'inProgress',
                    task: task
                }
            });
        }
    }

     // 4. Aceptar (Review -> Done) -> APPROVE
     if (
        startContainer === 'review' &&
        (overContainer === 'done' || activeContainer === 'done')
    ) {
        const task = tasks['done'].find(t => t.id.toString() === active.id.toString());
        if (task) {
            setTransitionModal({
                isOpen: true,
                type: 'APPROVE',
                pendingTransition: {
                    taskId: task.id,
                    source: 'review',
                    dest: 'done',
                    task: task
                }
            });
        }
    }

    // limpiar el cochinero
    setActiveId(null);
    setActiveTask(null);
    dragStartContainerRef.current = null;
  };

  const handleConfirmAssignment = async () => {
    if (pendingAssignment) {
        const { task } = pendingAssignment;
        
        try {
            const projectId = project.id || project.idProyecto;
            await autoAssignTask(task.id, projectId);

            const updatedTask = { 
                ...task, 
                members: [...(task.members || []), { name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.usuario }] 
            };
            
            // actualizar estado
            setTasks(prev => ({
                ...prev,
                inProgress: prev.inProgress.map(t => t.id === task.id ? updatedTask : t)
            }));
        } catch (error) {
            console.error("Error creating assignment:", error);
            alert("Error al auto-asignarte la tarea: " + error.message);
        }
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

  const handleConfirmTransition = (comment) => {
    const { pendingTransition, type } = transitionModal;

    if (pendingTransition) {
        const { task, dest } = pendingTransition;
        
        if (comment && comment.trim() !== '') {
             // Agregar comentario a la tarea
             const updatedTask = {
                 ...task,
                 comments: [...(task.comments || []), { 
                     id: Date.now(), 
                     text: comment, 
                     author: "Jose Cortez", 
                     timestamp: new Date().toISOString() 
                 }]
             };
             
             setTasks(prev => ({
                 ...prev,
                 [dest]: prev[dest].map(t => t.id === task.id ? updatedTask : t)
             }));
        }
    }
    setTransitionModal({ isOpen: false, type: null, pendingTransition: null });
  };

  const handleCancelTransition = () => {
      // deshacer movimiento si cancelan
      const { pendingTransition } = transitionModal;

      if (pendingTransition) {
        const { task, source, dest } = pendingTransition;
        
        setTasks(prev => {
             const isInDest = prev[dest].some(t => t.id === task.id);
             if (!isInDest) return prev;

             const destList = prev[dest].filter(t => t.id !== task.id);
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
      setTransitionModal({ isOpen: false, type: null, pendingTransition: null });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;

    try {
        await deleteTask(deletingTask.id);
        
        // Optimistic update or refresh
        const newTasks = { ...tasks };
        for (const column in newTasks) {
            newTasks[column] = newTasks[column].filter(t => t.id !== deletingTask.id);
        }
        setTasks(newTasks);
        setDeletingTask(null);
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Error al eliminar la tarea");
    }
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

  const handleManualAssign = (task) => {
      // Check if already assigned
      // members list might have objects { name: "..." } or { idUsuario: ... }
      // We check by name for now as that's what we have locally, ideally check by ID if available
      const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
      const isAssigned = task.members.some(m => m.name === userName || m.name === user?.usuario);
      
      if (!isAssigned) {
          setPendingAssignment({
              taskId: task.id,
              source: 'inProgress',
              dest: 'inProgress',
              task: task
          });
          setAssignModalOpen(true);
      } else {
          alert("Ya estás asignado a esta tarea.");
      }
  };

  return (
    <MainLayout 
      isBoardView={true} 
      projectName={project?.name || "Proyecto Ejemplo"} 
      onLogoClick={onBack}
      canGenerateReport={permissions.canGenerateReport}
      onLogout={onLogout}
      user={user}
    >
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
              onAddTask={permissions.canAdd ? () => setIsTaskModalOpen(true) : undefined}
              onEditTask={permissions.canEdit ? handleEditTask : undefined}
              onDeleteTask={permissions.canDelete ? handleDeleteTask : undefined}
              onCommentsTask={handleOpenComments}
            />
            <BoardColumn 
                id="inProgress"
                title="In progress" 
                tasks={tasks.inProgress} 
                color="#ef4444" 
                onEditTask={permissions.canEdit ? handleEditTask : undefined}
                onDeleteTask={permissions.canDelete ? handleDeleteTask : undefined}
                onCommentsTask={handleOpenComments}
                onAssignSelf={permissions.canAssignSelf ? handleManualAssign : undefined}
            />
            <BoardColumn 
                id="review"
                title="Review" 
                tasks={tasks.review} 
                color="#f97316" 
                onEditTask={permissions.canEdit ? handleEditTask : undefined}
                onDeleteTask={permissions.canDelete ? handleDeleteTask : undefined}
                onCommentsTask={handleOpenComments}
            />
            <BoardColumn 
                id="done"
                title="Done" 
                tasks={tasks.done} 
                color="#10b981" 
                onEditTask={permissions.canEdit ? handleEditTask : undefined}
                onDeleteTask={permissions.canDelete ? handleDeleteTask : undefined}
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
        project={project}
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

      <TaskTransitionModal
        isOpen={transitionModal.isOpen}
        type={transitionModal.type}
        onClose={handleCancelTransition}
        onConfirm={handleConfirmTransition}
        taskName={transitionModal.pendingTransition?.task.title}
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
