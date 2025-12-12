import React from 'react';
import { createProject, assignProductOwner, assignSDM, createTeam, addTeamMember, deleteTeam } from '../services/projectsService';
import { searchUser } from '../../users/services/usersService';

const CreateProjectModal = ({ isOpen, onClose, onNext }) => {
  const [step, setStep] = React.useState(1);
  
  // datos del proyecto
  const [projectId, setProjectId] = React.useState(null);
  const [productOwner, setProductOwner] = React.useState(null);
  const [sdm, setSdm] = React.useState(null);
  const [teams, setTeams] = React.useState([]);

  // lo que escribe el usuario
  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [deadline, setDeadline] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [newTeamName, setNewTeamName] = React.useState('');
  const [newTeamMembers, setNewTeamMembers] = React.useState([]);
  
  // errores y validaciones
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // cosas de la animacion
  const [isExiting, setIsExiting] = React.useState(false);
  const [containerHeight, setContainerHeight] = React.useState(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const containerRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const dateInputRef = React.useRef(null);

  // reiniciar todo cuando se abre
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProjectId(null);
      setProductOwner(null);
      setSdm(null);
      setProjectName('');
      setProjectDescription('');
      setDeadline('');
      setEmailInput('');
      setNewTeamName('');
      setNewTeamMembers([]);
      setErrors({});
      setIsExiting(false);
      setContainerHeight(null);
      setHasAnimated(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!projectName.trim()) {
        newErrors.projectName = true;
        isValid = false;
      }
      if (!projectDescription.trim()) {
        newErrors.projectDescription = true;
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!productOwner) {
        alert('Debes asignar un Product Owner para continuar');
        isValid = false;
      }
    }

    if (currentStep === 3) {
      if (!sdm) {
        alert('Debes asignar un SDM para continuar');
        isValid = false;
      }
    }

    if (currentStep === 5) { // paso de crear equipo
      if (!newTeamName.trim()) {
        newErrors.newTeamName = true;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStepTransition = async (nextStep) => {
    // solo validar si vamos pa delante
    if (step < nextStep) {
      if (!validateStep(step)) return;

      if (step === 1) {
         setIsSubmitting(true);
         try {
           const payload = {
            nombreProyecto: projectName,
            descripcion: projectDescription,
            fechaFin: deadline || null
           };
           const response = await createProject(payload);
           if (response.proyecto && response.proyecto.idProyecto) {
             setProjectId(response.proyecto.idProyecto);
             changeStep(nextStep);
           } else {
             changeStep(nextStep);
           }
         } catch (error) {
           alert(error.message);
         } finally {
           setIsSubmitting(false);
         }
      } else {
        changeStep(nextStep);
      }
    } else {
      changeStep(nextStep);
    }
  };

  const handleAddUser = async (targetSetter, currentInput, inputSetter) => {
    if (currentInput) {
      if (targetSetter === setProductOwner) {
        if (!projectId) {
          alert('Error: No hay ID de proyecto. Intenta volver al inicio.');
          return;
        }
        
        setIsSubmitting(true);
        try {
          const response = await assignProductOwner(projectId, currentInput);
          targetSetter({ name: currentInput });
          inputSetter('');
        } catch (error) {
          setErrors(prev => ({ ...prev, assignUserError: true }));
        } finally {
          setIsSubmitting(false);
        }
      } 
      else if (targetSetter === setSdm) {
        if (!projectId) {
          alert('Error: No hay ID de proyecto. Intenta volver al inicio.');
          return;
        }

        setIsSubmitting(true);
        try {
          const response = await assignSDM(projectId, currentInput);
          targetSetter({ name: currentInput });
          inputSetter('');
        } catch (error) {
           setErrors(prev => ({ ...prev, assignSdmError: true }));
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleAddTeamMember = async () => {
    if (emailInput) {
      if (newTeamMembers.some(m => m.email === emailInput)) {
        alert('Este usuario ya está en la lista');
        return;
      }

      setIsSubmitting(true);
      try {
        const user = await searchUser(emailInput);
        
        setNewTeamMembers([...newTeamMembers, { 
          name: user.nombre ? `${user.nombre} ${user.apellido || ''}` : user.usuario, 
          email: user.email || user.usuario, // fallback
          username: user.usuario
        }]);
        setEmailInput('');
      } catch (error) {
        alert('Usuario no encontrado: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveTeamMember = (index) => {
    const updated = [...newTeamMembers];
    updated.splice(index, 1);
    setNewTeamMembers(updated);
  };

  const handleCreateTeam = async () => {
    if (validateStep(5)) {
      if (!projectId) {
        alert('Error: No hay ID de proyecto.');
        return;
      }

      setIsSubmitting(true);
      try {
        // 1. Crear el equipo
        const teamResponse = await createTeam(projectId, newTeamName);
        const createdTeam = teamResponse.equipo; // { idEquipo: ..., nombreEquipo: ..., integrantes: [] }
         
        // 2. Agregar integrantes (si hay)
        const membersWithIds = [];
        if (newTeamMembers.length > 0 && createdTeam && createdTeam.idEquipo) {
            for (const member of newTeamMembers) {
                try {
                    await addTeamMember(createdTeam.idEquipo, projectId, member.email);
                    membersWithIds.push(member);
                } catch (memberError) {
                    console.error(`Error agregando a ${member.email}:`, memberError);
                    alert(`Error agregando a ${member.name}: ${memberError.message}`);
                    // Podríamos decidir si parar o seguir. Por ahora seguimos.
                }
            }
        }

        // 3. Actualizar estado local
        const newTeamForState = {
            id: createdTeam.idEquipo,
            name: createdTeam.nombreEquipo,
            members: membersWithIds
        };
        
        setTeams([...teams, newTeamForState]);
        
        // Limpiar form
        setNewTeamName('');
        setNewTeamMembers([]);
        changeStep(4);

      } catch (error) {
        alert('Error creando equipo: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveTeam = async (id) => {
    try {
        await deleteTeam(id);
        setTeams(teams.filter(t => t.id !== id));
    } catch (error) {
        alert('Error eliminando equipo: ' + error.message);
    }
  };

  const changeStep = (newStep) => {
    if (!containerRef.current) return;

    const currentHeight = containerRef.current.offsetHeight;
    setContainerHeight(currentHeight);
    setIsExiting(true);

    setTimeout(() => {
      setStep(newStep);
      setIsExiting(false);
      
      setTimeout(() => {
        if (contentRef.current) {
          const newHeight = contentRef.current.offsetHeight;
          setContainerHeight(newHeight);

          setTimeout(() => {
            setContainerHeight(null);
          }, 300);
        }
      }, 50);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div 
        ref={containerRef}
        style={{ height: containerHeight ? `${containerHeight}px` : 'auto' }}
        onAnimationEnd={() => setHasAnimated(true)}
        className={`bg-[#f0f0f5] rounded-[2rem] w-full max-w-2xl shadow-2xl relative z-10 mx-4 overflow-hidden transition-[height] duration-300 ease-in-out ${!hasAnimated ? 'animate-modal-grow origin-center' : ''}`}
      >
        <div className="p-8" ref={contentRef}>
          
          {/* PASO 1: datos del proyecto */}
          {step === 1 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Crear Proyecto</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Nombre del Proyecto *</label>
                  <input 
                    type="text" 
                    placeholder="Sistema de Gestión de Inventario" 
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      if (errors.projectName) setErrors({...errors, projectName: false});
                    }}
                    onFocus={() => {
                      if (errors.projectName) setErrors({...errors, projectName: false});
                    }}
                    className={`w-full px-4 py-3 rounded-full bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue ${errors.projectName ? 'border-red-500 ring-1 ring-red-500' : 'border-kanbas-blue'}`} 
                  />
                </div>
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Descripción *</label>
                  <textarea 
                    rows="3" 
                    placeholder="Plataforma para el control de stock y pedidos..."
                    value={projectDescription}
                    onChange={(e) => {
                      setProjectDescription(e.target.value);
                      if (errors.projectDescription) setErrors({...errors, projectDescription: false});
                    }}
                    onFocus={() => {
                      if (errors.projectDescription) setErrors({...errors, projectDescription: false});
                    }}
                    className={`w-full px-4 py-3 rounded-3xl bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue resize-none ${errors.projectDescription ? 'border-red-500 ring-1 ring-red-500' : 'border-kanbas-blue'}`}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Fecha Limite</label>
                  <div className="relative w-48">
                    <input 
                      type="text" 
                      placeholder="DD/MM/AAAA"
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
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button type="button" onClick={onClose} className="text-kanbas-blue font-bold hover:underline text-lg">Cancelar</button>
                  <button type="button" onClick={() => handleStepTransition(2)} className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">Siguiente &gt;</button>
                </div>
              </form>
            </div>
          )}

          {/* PASO 2: asignar al dueño */}
          {step === 2 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Asignar Product Owner</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Usuario / Email</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="nombre.apellido@empresa.com" 
                      value={emailInput} 
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (errors.assignUserError) setErrors({ ...errors, assignUserError: false });
                      }}
                      onFocus={() => {
                        if (errors.assignUserError) setErrors({ ...errors, assignUserError: false });
                      }}
                      className={`w-full px-4 py-3 rounded-full bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue ${errors.assignUserError ? 'border-red-500 ring-1 ring-red-500' : 'border-kanbas-blue'}`} 
                    />
                    <button onClick={() => handleAddUser(setProductOwner, emailInput, setEmailInput)} className="bg-kanbas-blue text-white rounded-full p-2 hover:bg-blue-600 transition shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
                {productOwner && (
                  <div className="flex items-center space-x-3 bg-[#cbd5e1] rounded-full px-4 py-2 w-max border border-kanbas-blue">
                    <span className="text-black font-medium">{productOwner.name}</span>
                    <div className="bg-kanbas-blue rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                  </div>
                )}
                <div className="flex items-center justify-end space-x-4 pt-12">
                  <button type="button" onClick={() => changeStep(1)} className="text-kanbas-blue font-bold hover:underline text-lg">&lt; Anterior</button>
                  <button 
                    type="button" 
                    onClick={() => handleStepTransition(3)} 
                    disabled={!productOwner}
                    className={`font-bold py-3 px-8 rounded-full transition duration-300 shadow-md ${!productOwner ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-kanbas-blue text-white hover:bg-blue-600'}`}
                  >
                    Siguiente &gt;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: asignar al sdm */}
          {step === 3 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Asignar SDM</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Usuario / Email</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="nombre.apellido@empresa.com" 
                      value={emailInput} 
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (errors.assignSdmError) setErrors({...errors, assignSdmError: false});
                      }} 
                      onFocus={() => {
                        if (errors.assignSdmError) setErrors({...errors, assignSdmError: false});
                      }}
                      className={`w-full px-4 py-3 rounded-full bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue ${errors.assignSdmError ? 'border-red-500 ring-1 ring-red-500' : 'border-kanbas-blue'}`} 
                    />
                    <button onClick={() => handleAddUser(setSdm, emailInput, setEmailInput)} className="bg-kanbas-blue text-white rounded-full p-2 hover:bg-blue-600 transition shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
                {sdm && (
                  <div className="flex items-center space-x-3 bg-[#cbd5e1] rounded-full px-4 py-2 w-max border border-kanbas-blue">
                    <span className="text-black font-medium">{sdm.name}</span>
                    <div className="bg-kanbas-blue rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                  </div>
                )}
                <div className="flex items-center justify-end space-x-4 pt-12">
                  <button type="button" onClick={() => changeStep(2)} className="text-kanbas-blue font-bold hover:underline text-lg">&lt; Anterior</button>
                  <button 
                    type="button" 
                    onClick={() => handleStepTransition(4)} 
                    disabled={!sdm}
                    className={`font-bold py-3 px-8 rounded-full transition duration-300 shadow-md ${!sdm ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-kanbas-blue text-white hover:bg-blue-600'}`}
                  >
                    Siguiente &gt;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: asignar equipos */}
          {step === 4 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Agregar Equipos</h2>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {teams.map((team) => (
                    <div key={team.id} className="bg-[#cbd5e1] rounded-full px-4 py-2 flex items-center space-x-2 group cursor-pointer hover:bg-[#b0c4de] transition relative pr-16">
                      <span className="text-black font-medium">{team.name}</span>
                      
                      <div className="absolute right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveTeam(team.id); }} className="text-gray-600 hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => changeStep(5)} className="bg-[#cbd5e1] rounded-full px-4 py-2 flex items-center justify-center hover:bg-[#b0c4de] transition">
                    <span className="text-black font-bold text-xl">+</span>
                  </button>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-12">
                  <button type="button" onClick={() => changeStep(3)} className="text-kanbas-blue font-bold hover:underline text-lg">&lt; Anterior</button>
                  <button type="button" onClick={onNext} className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">Finalizar</button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: crear nuevo equipo */}
          {step === 5 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Crear Equipo</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Nombre del Equipo *</label>
                  <input 
                    type="text" 
                    placeholder="Equipo de Desarrollo Backend" 
                    value={newTeamName} 
                    onChange={(e) => {
                      setNewTeamName(e.target.value);
                      if (errors.newTeamName) setErrors({...errors, newTeamName: false});
                    }}
                    onFocus={() => {
                      if (errors.newTeamName) setErrors({...errors, newTeamName: false});
                    }}
                    className={`w-full px-4 py-3 rounded-full bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue ${errors.newTeamName ? 'border-red-500 ring-1 ring-red-500' : 'border-kanbas-blue'}`} 
                  />
                </div>

                <div>
                  <label className="block text-black text-lg font-bold mb-2">Integrantes</label>
                  <label className="block text-black text-sm mb-1">Usuario / Email</label>
                  <div className="flex items-center space-x-2 mb-4">
                    <input type="text" placeholder="nombre.apellido@empresa.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue" />
                    <button onClick={handleAddTeamMember} className="bg-kanbas-blue text-white rounded-full p-2 hover:bg-blue-600 transition shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {newTeamMembers.map((member, index) => (
                      <div key={index} className="bg-[#cbd5e1] rounded-full px-4 py-2 flex items-center space-x-2 group border border-transparent hover:border-kanbas-blue transition relative pr-10">
                        <span className="text-black font-medium">{member.name}</span>
                        <div className="bg-kanbas-blue rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                        
                        <button 
                          onClick={() => handleRemoveTeamMember(index)}
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

                <div className="flex items-center justify-end space-x-4 pt-8">
                  <button type="button" onClick={() => changeStep(4)} className="text-kanbas-blue font-bold hover:underline text-lg">Cancelar</button>
                  <button type="button" onClick={handleCreateTeam} className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">Aceptar</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
