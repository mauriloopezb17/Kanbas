import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes); // agrupa todas las rutas

export default app;