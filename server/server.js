import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API Endpoints
app.get("/", (req, res) =>
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MERN Auth API</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #0f172a, #1e293b);
    font-family: Arial, sans-serif;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .container {
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 0 30px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
  }

  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    color: #38bdf8;
    font-weight: bold;
  }

  .status {
    margin-top: 20px;
    padding: 10px 20px;
    background: #22c55e;
    border-radius: 8px;
    color: #0f172a;
    font-weight: bold;
    display: inline-block;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>🚀 Welcome to MERN Auth API</h1>
    <p>Your backend is running successfully</p>
    <div class="status">✅ API IS WORKING</div>
  </div>
</body>
</html>
    `),
);
app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));

// 1:55:05
