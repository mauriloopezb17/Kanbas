import React, { useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import BoardColumn from '../components/BoardColumn';

const BoardPage = ({ project, onBack }) => {
  // Mock Data
  const [tasks] = useState({
    todo: [
      { id: 1, title: 'Tarea 1', description: 'Descripcion de ejemplo Descripcion de ejemplo' },
      { id: 2, title: 'Tarea 2', description: 'Descripcion de ejemplo Descripcion de ejemplo' },
      { id: 3, title: 'Tarea 3', description: 'Descripcion de ejemplo Descripcion de ejemplo Descripcion de ejemplo Descripcion de ejemplo' },
    ],
    inProgress: [
      { id: 4, title: 'Tarea 4', description: 'En progreso...' },
      { id: 5, title: 'Tarea 5', description: 'En progreso...' },
      { id: 6, title: 'Tarea 6', description: 'En progreso...' },
    ],
    review: [
      { id: 7, title: 'Tarea 1', description: 'Revision...' },
      { id: 8, title: 'Tarea 2', description: 'Revision...' },
      { id: 9, title: 'Tarea 3', description: 'Revision...' },
    ],
    done: [
      { id: 10, title: 'Tarea 4', description: 'Hecho...' },
      { id: 11, title: 'Tarea 5', description: 'Hecho...' },
      { id: 12, title: 'Tarea 6', description: 'Hecho...' },
    ]
  });

  return (
    <MainLayout isBoardView={true} projectName={project?.name || "Proyecto Ejemplo"} onLogoClick={onBack}>
      <div className="flex h-[calc(100vh-6rem)] overflow-x-auto gap-8 px-4 pb-4 items-stretch justify-center">
        <BoardColumn title="To do" tasks={tasks.todo} color="#0097b2" />
        <BoardColumn title="In progress" tasks={tasks.inProgress} color="#f87171" />
        <BoardColumn title="Review" tasks={tasks.review} color="#fb923c" />
        <BoardColumn title="Done" tasks={tasks.done} color="#4ade80" />
      </div>
    </MainLayout>
  );
};

export default BoardPage;
