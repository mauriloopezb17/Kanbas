export default class Equipo {
  constructor(row) {
    this.idEquipo = row.idequipo;
    this.idProyecto = row.idproyecto;
    this.nombreEquipo = row.nombreequipo;
    this.integrantes = [];
  }

  setNombre(nombreEquipo) {
    this.nombreEquipo = nombreEquipo;
  }
  getNombre() {
    return this.nombreEquipo;
  }

  setIdProyecto(idProyecto) {
    this.idProyecto = idProyecto;
  }
  getIdProyecto() {
    return this.idProyecto;
  }

  addIntegrante(integrante) {
    this.integrantes.push(integrante);
  }
  getIntegrantes() {
    return this.integrantes;
  }
}
