export default class Notificacion {
  constructor({ idNotificacion, fecha, contenido, titulo, autor }) {
    this.idNotificacion = idNotificacion;
    this.fecha = fecha;
    this.contenido = contenido;
    this.titulo = titulo;
    this.autor = autor;
  }

  setFecha(fecha) {
    this.fecha = fecha;
  }
  getFecha() {
    return this.fecha;
  }

  setContenido(contenido) {
    this.contenido = contenido;
  }
  getContenido() {
    return this.contenido;
  }

  setTitulo(titulo) {
    this.titulo = titulo;
  }
  getTitulo() {
    return this.titulo;
  }

  setAutor(autor) {
    this.autor = autor;
  }
  getAutor() {
    return this.autor;
  }
}
