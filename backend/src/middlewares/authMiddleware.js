import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"]; // token con header "Authorization" y formato "Bearer <token>"

  if (!authHeader) {
    return res.status(401).json({
      error: "No se proporcionó un token de autorización.",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      error: "Formato del token inválido.",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido o expirado.",
    });
  }
}

export default authMiddleware;
