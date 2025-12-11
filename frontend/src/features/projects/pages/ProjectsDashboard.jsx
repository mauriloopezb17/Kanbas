import React, { useState } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

const ProjectsDashboard = ({ user, onProjectClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de prueba para proyectos
  const projects = [
    { id: 1, name: 'Lanzamiento Mobile App', color: '#e9d5ff' }, // Morado claro
    { id: 2, name: 'Campaña Marketing Q4', color: '#fde047' }, // Amarillo
    { id: 3, name: 'Rediseño Sitio Web', color: '#f87171' }, // Rojo
  ];

  const handleNext = () => {
    console.log('Navigate to next step');
    setIsModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-normal text-black mb-8 font-sans">
          Bienvenido, {user?.firstName} {user?.lastName}
        </h2>

        <div className="mb-4">
          <h3 className="text-xl font-normal text-black mb-4 font-sans">Proyectos:</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div key={project.id} onClick={() => onProjectClick && onProjectClick(project)}>
                <ProjectCard 
                  name={project.name} 
                  color={project.color} 
                />
              </div>
            ))}

            {/* Botón Agregar Proyecto */}
            <div 
              onClick={() => setIsModalOpen(true)}
              className="w-full h-48 rounded-2xl border-2 border-dashed border-kanbas-blue bg-[#cbd5e1]/50 flex items-center justify-center cursor-pointer hover:bg-[#cbd5e1] transition"
            >
              <div className="bg-kanbas-blue rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onNext={handleNext}
      />
    </MainLayout>
  );
};

export default ProjectsDashboard;
