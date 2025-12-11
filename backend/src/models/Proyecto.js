export default class Proyecto {
  constructor(row) {
    this.idProyecto = row.idproyecto;
    this.nombreProyecto = row.nombreproyecto;
    this.descripcion = row.descripcion;

    this.fechaCreacion = row.fechacreacion;
    this.fechaFin = row.fechafin;

    this.tareas = [];
  }

  setNombre(nombreProyecto) {
    this.nombreProyecto = nombreProyecto;
  }
  getNombre() {
    return this.nombreProyecto;
  }

  setDescripcion(descripcion) {
    this.descripcion = descripcion;
  }
  getDescripcion() {
    return this.descripcion;
  }

  setFechaInicio(fechaCreacion) {
    this.fechaCreacion = fechaCreacion;
  }
  getFechaInicio() {
    return this.fechaCreacion;
  }

  setFechaFin(fechaFin) {
    this.fechaFin = fechaFin;
  }
  getFechaFin() {
    return this.fechaFin;
  }

  addTarea(tarea) {
    this.tareas.push(tarea);
  }
  getTareas() {
    return this.tareas;
  }
}
