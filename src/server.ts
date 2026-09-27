import express from "express";
import dotenv from "dotenv";

import conversationRoutes from "./routes/conversation.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Real Estate AI Agent is running"
  });
});

app.use("/api/conversation", conversationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});