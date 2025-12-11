export default class Tarea {
  constructor(row) {
    this.idTarea = row.idtarea ?? row.idTarea;
    this.idProyecto = row.idproyecto ?? row.idProyecto;
    this.idEquipo = row.idequipo ?? row.idEquipo;
    this.titulo = row.titulo;
    this.descripcion = row.descripcion;
    this.prioridad = row.prioridad;

    this.fechaCreacion = row.fechacreacion ?? row.fechaCreacion;
    this.fechaLimite = row.fechalimite ?? row.fechaLimite;

    this.estado = row.estado;
    this.responsable = row.responsable || null;
    this.comentarios = row.comentarios || [];
  }

  modificarDatos({ titulo, descripcion, prioridad, fechaLimite }) {
    if (titulo !== undefined) this.titulo = titulo;
    if (descripcion !== undefined) this.descripcion = descripcion;
    if (prioridad !== undefined) this.prioridad = prioridad;
    if (fechaLimite !== undefined) this.fechaLimite = fechaLimite;
  }
}
