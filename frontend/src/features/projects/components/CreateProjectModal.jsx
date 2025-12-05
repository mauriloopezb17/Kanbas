import React from 'react';

const CreateProjectModal = ({ isOpen, onClose, onNext }) => {
  const [step, setStep] = React.useState(1);
  
  // Data States
  const [productOwner, setProductOwner] = React.useState(null);
  const [sdm, setSdm] = React.useState(null);
  const [teams, setTeams] = React.useState([
    { id: 1, name: 'Equipo DB', members: [] },
    { id: 2, name: 'Equipo UI', members: [] },
    { id: 3, name: 'Equipo Marketing', members: [] },
  ]);

  // Input States
  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [newTeamName, setNewTeamName] = React.useState('');
  const [newTeamMembers, setNewTeamMembers] = React.useState([]);
  
  // Validation State
  const [errors, setErrors] = React.useState({});

  // Animation states
  const [isExiting, setIsExiting] = React.useState(false);
  const [containerHeight, setContainerHeight] = React.useState(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const containerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  // Reset to step 1 when opening
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProductOwner(null);
      setSdm(null);
      setProjectName('');
      setProjectDescription('');
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

    if (currentStep === 5) { // Create Team Step
      if (!newTeamName.trim()) {
        newErrors.newTeamName = true;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStepTransition = (nextStep) => {
    // Only validate when moving forward from step 1
    if (step === 1 && nextStep > 1) {
      if (validateStep(1)) {
        changeStep(nextStep);
      }
    } else {
      changeStep(nextStep);
    }
  };

  // Generic User Adder (simulated)
  const handleAddUser = (targetSetter, currentInput, inputSetter) => {
    if (currentInput) {
      const mockUser = { name: 'Usuario Simulado', email: currentInput };
      if (targetSetter === setProductOwner) mockUser.name = 'Carlos Montes';
      if (targetSetter === setSdm) mockUser.name = 'Pepe Pinto';
      
      targetSetter(mockUser);
      inputSetter('');
    }
  };

  const handleAddTeamMember = () => {
    if (emailInput) {
      const names = ['Pedro Parques', 'Miguel Pacheco', 'Ana Torres'];
      const randomName = names[newTeamMembers.length % names.length];
      setNewTeamMembers([...newTeamMembers, { name: randomName, email: emailInput }]);
      setEmailInput('');
    }
  };

  const handleRemoveTeamMember = (index) => {
    const updated = [...newTeamMembers];
    updated.splice(index, 1);
    setNewTeamMembers(updated);
  };

  const handleCreateTeam = () => {
    if (validateStep(5)) {
      const newTeam = {
        id: Date.now(),
        name: newTeamName,
        members: newTeamMembers
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setNewTeamMembers([]);
      changeStep(4);
    }
  };

  const handleRemoveTeam = (id) => {
    setTeams(teams.filter(t => t.id !== id));
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
          
          {/* STEP 1: Project Details */}
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
                    className={`w-full px-4 py-3 rounded-full bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2] ${errors.projectName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#0097b2]'}`} 
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
                    className={`w-full px-4 py-3 rounded-3xl bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2] resize-none ${errors.projectDescription ? 'border-red-500 ring-1 ring-red-500' : 'border-[#0097b2]'}`}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Fecha Limite</label>
                  <div className="relative w-48">
                    <input type="text" placeholder="DD/MM/AA" className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#0097b2] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2]" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0097b2]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button type="button" onClick={onClose} className="text-[#0097b2] font-bold hover:underline text-lg">Cancelar</button>
                  <button type="button" onClick={() => handleStepTransition(2)} className="bg-[#0097b2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#007a91] transition duration-300 shadow-md">Siguiente &gt;</button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Assign Product Owner */}
          {step === 2 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Asignar Product Owner</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Usuario / Email</label>
                  <div className="flex items-center space-x-2">
                    <input type="text" placeholder="nombre.apellido@empresa.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#0097b2] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2]" />
                    <button onClick={() => handleAddUser(setProductOwner, emailInput, setEmailInput)} className="bg-[#0097b2] text-white rounded-full p-2 hover:bg-[#007a91] transition shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
                {productOwner && (
                  <div className="flex items-center space-x-3 bg-[#cbd5e1] rounded-full px-4 py-2 w-max border border-[#0097b2]">
                    <span className="text-black font-medium">{productOwner.name}</span>
                    <div className="bg-[#0097b2] rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                  </div>
                )}
                <div className="flex items-center justify-end space-x-4 pt-12">
                  <button type="button" onClick={() => changeStep(1)} className="text-[#0097b2] font-bold hover:underline text-lg">&lt; Anterior</button>
                  <button type="button" onClick={() => changeStep(3)} className="bg-[#0097b2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#007a91] transition duration-300 shadow-md">Siguiente &gt;</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Assign SDM */}
          {step === 3 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Asignar SDM</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-black text-lg font-bold mb-2">Usuario / Email</label>
                  <div className="flex items-center space-x-2">
                    <input type="text" placeholder="nombre.apellido@empresa.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#0097b2] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2]" />
                    <button onClick={() => handleAddUser(setSdm, emailInput, setEmailInput)} className="bg-[#0097b2] text-white rounded-full p-2 hover:bg-[#007a91] transition shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
                {sdm && (
                  <div className="flex items-center space-x-3 bg-[#cbd5e1] rounded-full px-4 py-2 w-max border border-[#0097b2]">
                    <span className="text-black font-medium">{sdm.name}</span>
                    <div className="bg-[#0097b2] rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                  </div>
                )}
                <div className="flex items-center justify-end space-x-4 pt-12">
                  <button type="button" onClick={() => changeStep(2)} className="text-[#0097b2] font-bold hover:underline text-lg">&lt; Anterior</button>
                  <button type="button" onClick={() => changeStep(4)} className="bg-[#0097b2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#007a91] transition duration-300 shadow-md">Siguiente &gt;</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Assign Teams */}
          {step === 4 && (
            <div className={`${isExiting ? 'animate-fade-out' : 'animate-[fade-in_0.3s_ease-out_0.3s_both]'}`}>
              <h2 className="text-3xl font-bold text-black mb-6 font-sans">Agregar Equipos</h2>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {teams.map((team) => (
                    <div key={team.id} className="bg-[#cbd5e1] rounded-full px-4 py-2 flex items-center space-x-2 group cursor-pointer hover:bg-[#b0c4de] transition relative pr-16">
                      <span className="text-black font-medium">{team.name}</span>
                      
                      {/* Hover Actions */}
                      <div className="absolute right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Edit (Placeholder action) */}
                        <button className="text-gray-600 hover:text-[#0097b2]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        {/* Delete */}
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
                  <button type="button" onClick={() => changeStep(3)} className="text-[#0097b2] font-bold hover:underline text-lg">&lt; Anterior</button>
                  <button type="button" onClick={onNext} className="bg-[#0097b2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#007a91] transition duration-300 shadow-md">Finalizar</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Create Team */}
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
                    className={`w-full px-4 py-3 rounded-full bg-[#cbd5e1] border text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2] ${errors.newTeamName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#0097b2]'}`} 
                  />
                </div>

                <div>
                  <label className="block text-black text-lg font-bold mb-2">Integrantes</label>
                  <label className="block text-black text-sm mb-1">Usuario / Email</label>
                  <div className="flex items-center space-x-2 mb-4">
                    <input type="text" placeholder="nombre.apellido@empresa.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#0097b2] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2]" />
                    <button onClick={handleAddTeamMember} className="bg-[#0097b2] text-white rounded-full p-2 hover:bg-[#007a91] transition shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {newTeamMembers.map((member, index) => (
                      <div key={index} className="bg-[#cbd5e1] rounded-full px-4 py-2 flex items-center space-x-2 group border border-transparent hover:border-[#0097b2] transition relative pr-10">
                        <span className="text-black font-medium">{member.name}</span>
                        <div className="bg-[#0097b2] rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                        
                        {/* Trash Icon on Hover */}
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
                  <button type="button" onClick={() => changeStep(4)} className="text-[#0097b2] font-bold hover:underline text-lg">Cancelar</button>
                  <button type="button" onClick={handleCreateTeam} className="bg-[#0097b2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#007a91] transition duration-300 shadow-md">Aceptar</button>
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
