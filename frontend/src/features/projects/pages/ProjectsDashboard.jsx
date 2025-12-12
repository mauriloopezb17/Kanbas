import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import { getProjects } from '../services/projectsService';

const ProjectsDashboard = ({ user, onProjectClick, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNext = () => {
    setIsModalOpen(false);
    fetchProjects(); // Recargar lista al crear
  };

  return (
    <MainLayout onLogout={onLogout} user={user}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-normal text-black mb-8 font-sans">
          Bienvenido, {user?.firstName} {user?.lastName}
        </h2>

        <div className="mb-4">
          <h3 className="text-xl font-normal text-black mb-4 font-sans">Proyectos:</h3>
          
          {loading && <p>Cargando proyectos...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {!loading && projects.map((project) => {
              // Determinar rol
              let role = 'TEAM MEMBER';
              if (user && project.idSRM === user.idUsuario) role = 'SRM';
              else if (user && project.idSDM === user.idUsuario) role = 'SDM';
              else if (user && project.idPO === user.idUsuario) role = 'PO';

              return (
                <div key={project.id} onClick={() => onProjectClick && onProjectClick(project)}>
                  <ProjectCard 
                    name={project.name} 
                    color={project.color} 
                    role={role}
                  />
                </div>
              );
            })}

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
