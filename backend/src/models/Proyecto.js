export default class Proyecto {
  constructor({
    idProyecto,
    nombre,
    descripcion,
    fechaInicio,
    fechaFinEstimada,
    tareas = [],
  }) {
    this.idProyecto = idProyecto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaFinEstimada = fechaFinEstimada;
    this.tareas = tareas;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }
  getNombre() {
    return this.nombre;
  }

  setDescripcion(descripcion) {
    this.descripcion = descripcion;
  }
  getDescripcion() {
    return this.descripcion;
  }

  setFechaInicio(fechaInicio) {
    this.fechaInicio = fechaInicio;
  }
  getFechaInicio() {
    return this.fechaInicio;
  }

  setFechaFinEstimada(fechaFinEstimada) {
    this.fechaFinEstimada = fechaFinEstimada;
  }
  getFechaFinEstimada() {
    return this.fechaFinEstimada;
  }

  addTarea(tarea) {
    this.tareas.push(tarea);
  }
  getTareas() {
    return this.tareas;
  }
}
