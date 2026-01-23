import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json()); 

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Grocery backend is running 🚀",
  });
});


export default app;
