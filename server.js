const express = require("express");
const cors = require("cors"); // <-- import cors

const app = express();
const authRoutes = require("./routes/authRoutes");

// Enable CORS for requests from your frontend (http://localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
