import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json()); // parse JSON body

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Grocery backend is running 🚀",
  });
});

/* ---------- Routes placeholder ---------- */
// app.use("/api/items", itemRoutes);
// app.use("/api/auth", authRoutes);

export default app;
