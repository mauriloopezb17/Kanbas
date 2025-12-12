import React, { useState, useEffect, useRef } from 'react';
import { createComment, getComments, deleteComment } from '../services/commentsService';

const TaskCommentsModal = ({ isOpen, onClose, task, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  
  // cosas de la animacion
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  // ...
  const [loading, setLoading] = useState(false);

  // cargar los comentarios cuando se abre esto
  useEffect(() => {
    if (isOpen && task && task.id) {
       fetchComments();
       setHasAnimated(false);
    } else {
        setComments([]);
    }
  }, [task, isOpen]);

  const fetchComments = async () => {
      try {
          setLoading(true);
          const data = await getComments(task.id);
          // Backend returns: [{ idComentario, contenido, fecha, idTarea, idUsuario, ... }]
          // We map to UI format
          const formatted = data.map(c => {
               const fullName = (c.nombre && c.apellido) ? `${c.nombre} ${c.apellido}`.trim() : c.nombre || c.apellido || c.usuario;
               return {
                  id: c.idcomentario,
                  user: fullName || 'Usuario',
                  text: c.contenido,
                  date: new Date(c.fecha).toLocaleString()
               };
          });
          setComments(formatted);
      } catch (error) {
          console.error("Error fetching comments:", error);
      } finally {
          setLoading(false);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
        await createComment(task.id, newComment);
        
        // Refresh comments
        await fetchComments();
        
        setNewComment('');
        
        // Notify parent if needed (optional)
        if (onAddComment) {
            onAddComment(task.id, { text: newComment });
        }
    } catch (error) {
        console.error("Error creating comment:", error);
        alert("Error al crear comentario: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* el fondo oscurito */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* la cajita del modal */}
      <div 
        ref={containerRef}
        onAnimationEnd={() => setHasAnimated(true)}
        className={`bg-[#f0f0f5] rounded-[2rem] w-full max-w-xl shadow-2xl relative z-10 mx-4 overflow-hidden flex flex-col max-h-[85vh] ${!hasAnimated ? 'animate-modal-grow origin-center' : ''}`}
      >
        
        {/* titulo y eso */}
        <div className="p-8 pb-2 flex justify-between items-start shrink-0">
            <h2 className="text-3xl font-bold text-black font-sans">
                Comentarios de la <span className="text-kanbas-blue">{task?.title || 'Tarea'}</span>
            </h2>
            <button onClick={onClose} className="text-kanbas-blue hover:text-blue-700 transition transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* aqui van los comentarios */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-4 min-h-0 custom-scrollbar">
            {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8 italic">No hay comentarios aún.</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} className="bg-[#cbd5e1] rounded-3xl p-5 relative group">
                        <div className="flex gap-4">
                            {/* fotico */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-kanbas-blue shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* lo que escribieron */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{comment.user}</h4>
                                    <span className="text-xs text-gray-600 flex-shrink-0 ml-2">{comment.date}</span>
                                </div>
                                <p className="text-gray-800 text-sm break-words leading-relaxed font-medium">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* para escribir nuevo */}
        <div className="p-8 pt-2 bg-[#f0f0f5] shrink-0">
            <label className="block text-black text-lg font-bold mb-2">Agregar Comentarios</label>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-[#cbd5e1] border-2 border-transparent focus:border-kanbas-blue rounded-3xl p-4 text-gray-800 placeholder-gray-600 focus:outline-none transition-colors resize-none h-28 text-base shadow-inner"
                placeholder="Escribe un comentario..."
            ></textarea>
            
            <div className="flex justify-end items-center mt-6 gap-6">
                <button 
                    onClick={onClose}
                    className="text-kanbas-blue font-bold hover:underline text-lg"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={!newComment.trim()}
                    className="bg-kanbas-blue text-white font-bold py-3 px-10 rounded-full hover:bg-blue-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Aceptar
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TaskCommentsModal;
