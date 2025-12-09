import React, { useState, useRef, useEffect } from 'react';

const CreateTaskModal = ({ isOpen, onClose, taskToEdit }) => {
  // estados de los datos
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Backend'); // por defecto pa probar
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Alta'); // por defecto pa probar
  const [selectedMember, setSelectedMember] = useState('');
  const [assignedMembers, setAssignedMembers] = useState([]);

  // opciones de mentira
  const teams = ['Backend', 'Frontend', 'Design', 'QA'];
  const priorities = ['Baja', 'Media', 'Alta'];
  const availableMembers = ['Nadie', 'Pedro Parques', 'Jose Cortez', 'Ana Torres', 'Miguel Pacheco'];

  // cosas de animacion
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const dateInputRef = useRef(null);

  // limpiar o llenar cuando se abre
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTaskName(taskToEdit.title || '');
        setDescription(taskToEdit.description || '');
        setSelectedTeam(taskToEdit.team || 'Backend');
        setDeadline(taskToEdit.deadline || '');
        setPriority(taskToEdit.priority || 'Alta');
        
        // si ocupamos parsear los miembros pues aqui, sino directo
        setAssignedMembers(taskToEdit.members || []);
      } else {
        setTaskName('');
        setDescription('');
        setSelectedTeam('Backend');
        setDeadline('');
        setPriority('Alta');
        setSelectedMember('Nadie');
        setAssignedMembers([]);
      }
      setHasAnimated(false);
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (selectedMember && selectedMember !== 'Nadie' && !assignedMembers.some(m => m.name === selectedMember)) {
      setAssignedMembers([...assignedMembers, { name: selectedMember, avatar: null }]);
      setSelectedMember('Nadie');
    }
  };

  const handleRemoveMember = (index) => {
    const updated = [...assignedMembers];
    updated.splice(index, 1);
    setAssignedMembers(updated);
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
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-kanbas-blue appearance-none cursor-pointer"
                    >
                        {teams.map(t => <option key={t} value={t}>{t}</option>)}
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
                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
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
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-kanbas-blue appearance-none cursor-pointer"
                    >
                        {availableMembers.map(m => <option key={m} value={m}>{m}</option>)}
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
              <button type="button" onClick={onClose} className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">Aceptar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
