import React, { useEffect, useState, useMemo } from 'react';
import { getProjectReport } from '../features/reports/services/reportsService';

const ProjectReportModal = ({ isOpen, onClose, project = {} }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && project?.id || project?.idProyecto) {
        const projectId = project.id || project.idProyecto;
        fetchReport(projectId);
    }
  }, [isOpen, project]);

  const fetchReport = async (id) => {
      setLoading(true);
      setError(null);
      try {
          const data = await getProjectReport(id);
          setReportData(data);
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  const handlePrint = () => {
    window.print();
  };

  const aggregatedLineData = useMemo(() => {
      if (!reportData?.grafico2) return [];
      
      const countsByDate = {};
      reportData.grafico2.forEach(t => {
          if (!t.fechaEntrega) return;
          const date = new Date(t.fechaEntrega).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
          countsByDate[date] = (countsByDate[date] || 0) + 1;
      });
      
      return Object.entries(countsByDate).map(([date, count]) => ({ date, count }));
  }, [reportData]);
  
  // Helpers for Scalable SVG Charts
  // ------------------------------------------

  const BarChart = ({ data }) => {
      if (!data || data.length === 0) return <div className="h-48 flex items-center justify-center text-gray-400">Sin datos</div>;
      
      // Find max for scaling
      const maxVal = Math.max(...data.map(d => d.tareasCompletadas), 1);
      
      return (
        <svg viewBox="0 0 400 200" className="w-full h-48">
           {/* Axes */}
           <line x1="120" y1="180" x2="380" y2="180" stroke="#ddd" strokeWidth="1" />
           <line x1="120" y1="20" x2="120" y2="180" stroke="#ddd" strokeWidth="1" />
           
           {data.map((d, i) => {
               const barWidth = (d.tareasCompletadas / maxVal) * 240; // Max width ~240px
               const yPos = 30 + (i * 25);
               
               return (
                   <g key={i}>
                       <rect x="120" y={yPos} width={barWidth} height="15" fill="#67E8F9" rx="2" />
                       <text x="125" y={yPos + 11} fontSize="10" fill="#0e7490">{d.tareasCompletadas}</text>
                       <text x="110" y={yPos + 11} textAnchor="end" fontSize="10" fill="#333">
                           {d.nombreIntegrante}
                       </text>
                   </g>
               );
           })}
           
           <text x="250" y="195" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#666">Tareas Realizadas</text>
        </svg>
      );
  };

  const LineChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="h-48 flex items-center justify-center text-gray-400">Sin datos</div>;

    // Scales
    const maxVal = Math.max(...data.map(d => d.count), 5); // Minimum chart height of 5
    // X-axis: distribute points evenly
    const stepX = 300 / Math.max(data.length - 1, 1);
    
    const points = data.map((d, i) => {
        const x = 50 + (i * stepX);
        const y = 180 - ((d.count / maxVal) * 140); // Max height ~140px
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 400 200" className="w-full h-48">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = 180 - (tick * 140);
            return (
                <g key={i}>
                    <line x1="50" y1={y} x2="380" y2={y} stroke="#eee" strokeWidth="1" />
                    <text x="40" y={y + 3} textAnchor="end" fontSize="8" fill="#999">{Math.round(tick * maxVal)}</text>
                </g>
            );
        })}

        {/* Line */}
        <polyline 
            points={points}
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="2" 
        />
        
        {/* Dots & Labels */}
        {data.map((d, i) => {
             const x = 50 + (i * stepX);
             const y = 180 - ((d.count / maxVal) * 140);
             return (
                 <g key={i}>
                     <circle cx={x} cy={y} r="3" fill="#06b6d4" />
                     <text x={x} y="195" textAnchor="middle" fontSize="10" fill="#666">{d.date}</text>
                 </g>
             );
        })}
        </svg>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div 
        id="project-report-content"
        className="bg-[#f0f2f5] rounded-3xl w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
      >
        {loading ? (
            <div className="flex-1 flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kanbas-blue"></div>
            </div>
        ) : error ? (
             <div className="p-10 text-center">
                 <p className="text-red-500 font-bold mb-4">{error}</p>
                 <button onClick={onClose} className="text-gray-500 underline">Cerrar</button>
             </div>
        ) : reportData ? (
        <>
            {/* Header - Printable */}
            <div className="bg-white p-6 pb-4 border-b">
            <h2 className="text-3xl font-bold text-kanbas-blue font-sans">
                Reporte del {permissionName(reportData.proyecto?.nombre)}
            </h2>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
            
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{reportData.proyecto?.nombre}</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Descripción: {reportData.proyecto?.descripcion || 'Sin descripción'}</li>
                        <li>Proyecto generado el {new Date(reportData.proyecto?.fechaCreacion).toLocaleDateString()}</li>
                        <li>Reporte generado el {new Date().toLocaleDateString()}</li>
                    </ul>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Total de tareas creadas: <span className="text-kanbas-blue">{reportData.tareas?.total}</span></h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Tareas en espera: <span className="text-kanbas-blue font-bold">{reportData.tareas?.todo}</span></li>
                        <li>Tareas en desarrollo: <span className="text-red-500 font-bold">{reportData.tareas?.inProgress}</span></li>
                        <li>Tareas en revisión: <span className="text-orange-500 font-bold">{reportData.tareas?.review}</span></li>
                        <li>Tareas finalizadas: <span className="text-green-500 font-bold">{reportData.tareas?.done}</span></li>
                    </ul>
                </div>
            </div>

            <hr className="border-gray-300" />

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold mb-2 text-black">Equipos: {reportData.equipos?.length || 0}</h3>
                    <ul className="space-y-2">
                        {reportData.equipos && reportData.equipos.map((team, idx) => (
                            <li key={idx}>
                                <span className="font-semibold text-gray-800">• {team.nombreEquipo}</span>
                                <ul className="pl-6 text-gray-600 text-sm">
                                    {team.integrantes && team.integrantes.map((m, i) => <li key={i}>◦ {m.nombre}</li>)}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2 text-black">Roles del proyecto</h3>
                    <ul className="space-y-2 list-disc pl-5 text-gray-700">
                        {reportData.proyecto?.roles && reportData.proyecto.roles.map((r, i) => (
                            <li key={i}><span className="font-semibold">{r.rol}:</span> {r.nombre}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <hr className="border-gray-300" />

            {/* Row 3 - Charts */}
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <h4 className="text-center font-bold mb-4 text-gray-700">Tareas completadas / Integrante</h4>
                    <BarChart data={reportData.grafico1} />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <h4 className="text-center font-bold mb-4 text-gray-700">Tareas completadas / Tiempo</h4>
                    <LineChart data={aggregatedLineData} />
                </div>
            </div>

            </div>
        </>
        ) : null}

        {/* Footer actions - No Print */}
        <div className="bg-white p-4 border-t flex justify-end space-x-4 no-print rounded-b-3xl">
           <button 
             onClick={onClose}
             className="px-4 py-2 text-gray-500 hover:text-gray-700 font-bold"
           >
             Cerrar
           </button>
           <button 
             onClick={handlePrint}
             className="px-6 py-2 bg-kanbas-blue text-white rounded-full font-bold shadow-lg hover:bg-blue-600 transition"
           >
             Descargar
           </button>
        </div>
      </div>
      
      {/* Search-optimized print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #project-report-content, #project-report-content * {
            visibility: visible;
          }
          #project-report-content {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          /* Ensure backgrounds print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

// Helper mainly to avoid weird undefined if project is loading or not passed initially
// though fetching logic handles it.
const permissionName = (name) => name || 'Proyecto';

export default ProjectReportModal;
