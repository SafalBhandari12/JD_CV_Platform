import express from "express";
import { setMiddleware } from "./config/setMiddleware";
import envConfig from "./config/getEnvConfig";
import apiRoutes from "./routes/api";
import { setupSwagger } from "./config/swagger.config";
import errorHandler from "./middleware/customErrorHandler";

const app = express();
const PORT = envConfig.PORT;

// Set middleware
setMiddleware(app);

// Set up Swagger
setupSwagger(app);

// Setting up api endpoint
app.use("/api", apiRoutes);

// Health
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Register error handler after all routes
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
