import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import authMiddleware from "./middleware/auth.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "E2B Agent Server is running",
  });
});

app.get("/protected",authMiddleware)

app.use("/auth",authRoutes)



export default app;
