const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const booksRouter = require("./routes/bookRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const cors = require("cors");
const serverless = require("serverless-http");

dotenv.config();

// Connect only once (works on Vercel)
connectDB();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://myfrontend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/books", booksRouter);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Local Dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

// 💥 FIX: Correct Vercel export
module.exports= serverless(app);
