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


app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",      // React dev server
  "https://myfrontend.vercel.app" // deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));



app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/books", booksRouter);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// If running locally, start server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

// Export handler for Vercel

module.exports.handler = async (event, context) => {
  await connectDB();   // <-- Connect ONCE per cold start
  const handler = serverless(app);
  return handler(event, context);
};
