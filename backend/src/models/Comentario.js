export default class Comentario {
  constructor({ idComentario, contenido, fecha, autor }) {
    this.idComentario = idComentario;
    this.contenido = contenido;
    this.fecha = fecha;
    this.autor = autor;
  }
}
