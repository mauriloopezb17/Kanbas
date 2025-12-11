import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // en caso de activar frontend de manera local
  "http://100.91.154.18:5173", // compu Ale
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Para pruebas en postman y thunder client

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS: No autorizado por el servidor"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", routes);

export default app;
