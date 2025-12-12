import React, { useState, useRef, useEffect } from 'react';
import { getTeamsByProject, getTeamMembers } from '../../teams/services/teamsService';
import { createTask, updateTask, getTaskById } from '../../tasks/services/tasksService';

const CreateTaskModal = ({ isOpen, onClose, taskToEdit, project }) => {
  // estados de los datos
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(''); // ID del equipo
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('1'); // 1: Alta, 2: Media, 3: Baja (segun backend quizas diferente, asumiremos int)
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [assignedMembers, setAssignedMembers] = useState([]); // [{id, name}]

  // estados de carga de datos
  const [teams, setTeams] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // opciones estáticas
  const priorities = [
      { id: 1, label: 'Alta' },
      { id: 2, label: 'Media' },
      { id: 3, label: 'Baja' }
  ];

  // cosas de animacion
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const dateInputRef = useRef(null);

  // Cargar equipos al abrir o cambiar proyecto
  useEffect(() => {
      const fetchTeams = async () => {
          if (isOpen && project?.id) {
              try {
                  setLoadingTeams(true);
                  const data = await getTeamsByProject(project.id);
                  setTeams(data);
                  if (data.length > 0 && !taskToEdit) {
                      setSelectedTeamId(data[0].idEquipo || data[0].idequipo); // Preseleccionar primero
                  }
              } catch (error) {
                  console.error("Error loading teams:", error);
              } finally {
                  setLoadingTeams(false);
              }
          }
      };
      
      fetchTeams();
  }, [isOpen, project, taskToEdit]);

  // Cargar miembros cuando cambia el equipo seleccionado
  useEffect(() => {
      const fetchMembers = async () => {
          if (selectedTeamId) {
              try {
                  setLoadingMembers(true);
                  const data = await getTeamMembers(selectedTeamId);
                  setAvailableMembers(data);
                  setSelectedMemberId(''); // Reset seleccion de miembro
              } catch (error) {
                  console.error("Error loading members:", error);
                  setAvailableMembers([]);
              } finally {
                  setLoadingMembers(false);
              }
          } else {
              setAvailableMembers([]);
          }
      };

      fetchMembers();
  }, [selectedTeamId]);


  // Cargar detalles de la tarea si estamos editando
  useEffect(() => {
    const fetchTaskDetails = async () => {
        if (isOpen && taskToEdit && project?.id) {
            try {
                // Fetch full details
                const fullTask = await getTaskById(taskToEdit.id, project.id);
                
                setTaskName(fullTask.titulo || fullTask.title || '');
                setDescription(fullTask.descripcion || fullTask.description || '');
                setSelectedTeamId(fullTask.idEquipo || fullTask.idequipo || '');
                setDeadline(fullTask.fechaLimite || fullTask.deadline || '');
                setPriority(fullTask.prioridad || fullTask.priority || 1);
                
                // Map asignados
                if (fullTask.asignados) {
                    const mappedMembers = fullTask.asignados.map(m => ({
                        id: m.idusuario || m.idUsuario, // Ojo: en backend asignados trae idusuario, no idintegrante? Revisar imagen. 
                        // Ah, la imagen dice "asignados": [ { "idusuario": 7 ... }]. 
                        // Pero para crear tarea usamos idIntegrante. 
                        // El backend devuelve idUsuario en asignados? 
                        // La imagen muestra: "asignados": [ { "idusuario": 7, "nombre": "Jose"... } ]
                        // Pero create task pide "integrantes": [id1, id2].
                        // El payload de create task pide IDs de integrantes? "integrantes": [1, 2] (ids 1 y 2).
                        // Necesitamos saber el ID INTEGRANTE de esos usuarios.
                        // La imagen de fetch integrantes dice "idintegrante": 1, "idusuario": 7.
                        // Entonces si la tarea devuelve idusuario, tenemos que matchearlos con los integrantes del equipo seleccionado para obtener el idintegrante.
                        // Esto es tricky.
                        // Solucion: Cargar los miembros del equipo (que trae idusuario y idintegrante) y matchear por idusuario.
                        // Pero `availableMembers` se carga cuando `selectedTeamId` cambia.
                        // Asi que primero seteamos selectedTeamId, eso dispara el fetch de miembros, y LUEGO (o a la vez) seteamos los asignados.
                        // Problema: useEffect de members es async.
                        name: `${m.nombre} ${m.apellido}`.trim(),
                        idUsuario: m.idusuario || m.idUsuario 
                    }));
                    // Guardamos temporalmente con idUsuario y luego en el render/submit resolvemos?
                    // Mejor esperamos a que carguen los miembros para matchear.
                    setAssignedMembers(mappedMembers);
                } else {
                    setAssignedMembers([]);
                }

            } catch (error) {
                console.error("Error loading task details:", error);
            }
        } else if (isOpen && !taskToEdit) {
            // Reset for create
            setTaskName('');
            setDescription('');
            setDeadline('');
            setPriority(1);
            setSelectedMemberId('');
            setAssignedMembers([]);
            // Team se maneja en fetchTeams
        }
        setHasAnimated(false);
    };

    fetchTaskDetails();
  }, [isOpen, taskToEdit, project]);

  // Efecto para reconciliar miembros asignados (recuperar idIntegrante) una vez que availableMembers cargó
  useEffect(() => {
      if (availableMembers.length > 0 && assignedMembers.length > 0) {
          // Intentar enriquecer los miembros asignados con idIntegrante si les falta
          const enriched = assignedMembers.map(am => {
              if (am.id) return am; // Ya tiene id (idIntegrante)
              
              const match = availableMembers.find(m => (m.idusuario || m.idUsuario) === am.idUsuario);
              if (match) {
                  return {
                      ...am,
                      id: match.idintegrante || match.idIntegrante // Ahora si es el idIntegrante
                  };
              }
              return am;
          });
          
          // Solo actualizar si hubo cambios para evitar loop infinito
          if (JSON.stringify(enriched) !== JSON.stringify(assignedMembers)) {
               setAssignedMembers(enriched);
          }
      }
  }, [availableMembers]); // Ojo con assignedMembers aqui para no loop

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (selectedMemberId) {
        const member = availableMembers.find(m => (m.idintegrante || m.idIntegrante).toString() === selectedMemberId.toString());
        if (member && !assignedMembers.some(m => m.id === (member.idintegrante || member.idIntegrante))) {
            setAssignedMembers([...assignedMembers, { 
                id: member.idintegrante || member.idIntegrante, 
                name: `${member.nombre} ${member.apellido}`.trim(),
                avatar: null 
            }]);
            setSelectedMemberId('');
        }
    }
  };

  const handleRemoveMember = (index) => {
    const updated = [...assignedMembers];
    updated.splice(index, 1);
    setAssignedMembers(updated);
  };

  const handleSubmit = async () => {
      try {
          if (!taskName || !description || !selectedTeamId) {
              alert("Por favor completa los campos obligatorios");
              return;
          }

          // Filtrar miembros que no tengan ID valido (idIntegrante)
          const validMembers = assignedMembers
            .map(m => m.id)
            .filter(id => id !== undefined && id !== null);

          const payload = {
              idProyecto: project.id,
              idEquipo: parseInt(selectedTeamId),
              titulo: taskName,
              descripcion: description,
              prioridad: parseInt(priority),
              fechaLimite: deadline ? new Date(deadline).toISOString() : null,
              integrantes: validMembers
          };

          if (taskToEdit) {
              await updateTask(taskToEdit.id, project.id, payload);
          } else {
              await createTask(payload);
          }
          
          onClose();
          window.location.reload(); 
      } catch (error) {
          console.error("Error saving task:", error);
          alert("Error al guardar la tarea: " + error.message);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div 
        ref={containerRef}
        onAnimationEnd={() => setHasAnimated(true)}
        className={`bg-[#f0f0f5] rounded-[2rem] w-full max-w-2xl shadow-2xl relative z-10 mx-4 overflow-hidden ${!hasAnimated ? 'animate-modal-grow origin-center' : ''}`}
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-black mb-6 font-sans">{taskToEdit ? 'Editar Tarea' : 'Agregar Tarea'}</h2>
          
          <form className="space-y-4">
            {/* nombre tarea */}
            <div>
              <label className="block text-black text-lg font-bold mb-2">Nombre de la tarea *</label>
              <input 
                type="text" 
                placeholder="Diseño de la DB" 
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue" 
              />
            </div>

            {/* descripcion */}
            <div>
              <label className="block text-black text-lg font-bold mb-2">Descripción *</label>
              <textarea 
                rows="3" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-3xl bg-[#cbd5e1] border border-kanbas-blue text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue resize-none"
              ></textarea>
            </div>

            {/* fila de cosas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* equipo */}
              <div>
                <label className="block text-black text-lg font-bold mb-2">Equipo *</label>
                <div className="relative">
                    <select 
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-kanbas-blue appearance-none cursor-pointer"
                        disabled={loadingTeams}
                    >
                        {loadingTeams ? <option>Cargando...</option> : teams.map(t => (
                            <option key={t.idEquipo || t.idequipo} value={t.idEquipo || t.idequipo}>
                                {t.nombreEquipo || t.nombreequipo}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-kanbas-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
              </div>

              {/* fecha */}
              <div>
                <label className="block text-black text-lg font-bold mb-2">Fecha Limite</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="DD/MM/AA"
                    readOnly
                    value={deadline ? deadline.split('-').reverse().join('/') : ''}
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue cursor-pointer" 
                  />
                  <input 
                    ref={dateInputRef}
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                    tabIndex={-1}
                  />
                  <div 
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-kanbas-blue cursor-pointer hover:text-blue-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
              </div>

              {/* prioridad */}
              <div>
                <label className="block text-black text-lg font-bold mb-2">Prioridad</label>
                <div className="relative">
                    <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-kanbas-blue appearance-none cursor-pointer"
                    >
                        {priorities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-kanbas-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
              </div>
            </div>

            {/* gente */}
            <div>
              <label className="block text-black text-lg font-bold mb-2">Integrante</label>
              <div className="flex items-center space-x-2 mb-4">
                 <div className="relative w-full">
                    <select 
                        value={selectedMemberId}
                        onChange={(e) => setSelectedMemberId(e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-kanbas-blue appearance-none cursor-pointer"
                        disabled={loadingMembers}
                    >
                        <option value="">Selecciona un integrante</option>
                        {loadingMembers ? <option>Cargando...</option> : availableMembers.map(m => (
                            <option key={m.idintegrante || m.idIntegrante} value={m.idintegrante || m.idIntegrante}>
                                {m.nombre} {m.apellido}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-kanbas-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <button 
                  type="button"
                  onClick={handleAddMember} 
                  className="bg-kanbas-blue text-white rounded-full p-2 hover:bg-blue-600 transition shadow-md flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>

              {/* las bolitas de los miembros */}
              <div className="flex flex-wrap gap-3">
                {assignedMembers.map((member, index) => (
                  <div key={index} className="bg-[#cbd5e1] rounded-full px-4 py-2 flex items-center space-x-2 group border border-transparent hover:border-kanbas-blue transition relative min-w-[150px] pr-10">
                    <span className="text-black font-medium">{member.name}</span>
                    <div className="bg-kanbas-blue rounded-full p-1 ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {/* borrar cuando pasas el mouse */}
                    <button 
                      onClick={() => handleRemoveMember(index)}
                      className="absolute right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* botones de accion */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="text-kanbas-blue font-bold hover:underline text-lg">Cancelar</button>
              <button type="button" onClick={handleSubmit} className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">Aceptar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
