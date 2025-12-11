function errorMiddleware(err, req, res, next) {
  console.error("Error global:", err);
  return res.status(500).json({
    error: err.message || "Error interno del servidor",
  });
}

export default errorMiddleware;
