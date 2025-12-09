export default class Tarea {
  constructor({
    idTarea,
    titulo,
    descripcion,
    prioridad,
    fechaCreacion,
    fechaLimite,
    estado,
    responsable = null,
    comentarios = [],
  }) {
    this.idTarea = idTarea;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.prioridad = prioridad;
    this.fechaCreacion = fechaCreacion;
    this.fechaLimite = fechaLimite;
    this.estado = estado;
    this.responsable = responsable;
    this.comentarios = comentarios;
  }

  modificarDatos({ titulo, descripcion, prioridad, fechaLimite }) {
    if (titulo) this.titulo = titulo;
    if (descripcion) this.descripcion = descripcion;
    if (prioridad) this.prioridad = prioridad;
    if (fechaLimite) this.fechaLimite = fechaLimite;
  }
}
