export default class Usuario {
  constructor({ idUsuario, nombre, apellido, usuario, email, password }) {
    this.idUsuario = idUsuario;
    this.nombre = nombre;
    this.apellido = apellido;
    this.usuario = usuario;
    this.email = email;
    this.password = password;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }
  getNombre() {
    return this.nombre;
  }

  setApellido(apellido) {
    this.apellido = apellido;
  }
  getApellido() {
    return this.apellido;
  }

  setUsuario(usuario) {
    this.usuario = usuario;
  }
  getUsuario() {
    return this.usuario;
  }

  setEmail(email) {
    this.email = email;
  }
  getEmail() {
    return this.email;
  }

  setPassword(password) {
    this.password = password;
  }
  getPassword() {
    return this.password;
  }
}
