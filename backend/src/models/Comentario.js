export default class Comentario {
  constructor({ idcomentario, contenido, fecha, idtarea, idusuario }) {
    this.idComentario = idcomentario;
    this.contenido = contenido;
    this.fecha = fecha;
    this.idTarea = idtarea;
    this.idUsuario = idusuario;
  }
}
