export default class Tarea {
  constructor(row) {
    this.idTarea = row.idTarea !== undefined ? row.idTarea : row.idtarea;

    this.titulo = row.titulo;
    this.descripcion = row.descripcion;
    this.prioridad = row.prioridad;

    this.fechaCreacion =
      row.fechaCreacion !== undefined ? row.fechaCreacion : row.fechacreacion;

    this.fechaLimite =
      row.fechaLimite !== undefined ? row.fechaLimite : row.fechalimite;

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
