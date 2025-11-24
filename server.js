const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const booksRouter = require("./routes/bookRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cors = require("cors");


dotenv.config();

// Connect only once (works on Vercel)
connectDB();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://myfrontend.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});


// Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/books", booksRouter);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Local Dev
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on ${PORT}`));
// }

// 💥 FIX: Correct Vercel export
module.exports= app;
