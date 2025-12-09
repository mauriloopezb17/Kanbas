export default class Equipo {
  constructor({ idEquipo, nombreEquipo, integrantes = [] }) {
    this.idEquipo = idEquipo;
    this.nombreEquipo = nombreEquipo;
    this.integrantes = integrantes;
  }

  setNombreEquipo(nombreEquipo) {
    this.nombreEquipo = nombreEquipo;
  }
  getNombreEquipo() {
    return this.nombreEquipo;
  }

  setIntegrantes(integrantes) {
    this.integrantes = integrantes;
  }
  getIntegrantes() {
    return this.integrantes;
  }
}
