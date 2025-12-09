export default class ReporteRendimiento {
  constructor({ idReporte, fechaGeneracion, metrics }) {
    this.idReporte = idReporte;
    this.fechaGeneracion = fechaGeneracion;
    this.metrics = metrics;
  }

  setMetrics(metrics) {
    this.metrics = metrics;
  }
  getMetrics() {
    return this.metrics;
  }
}
