const express = require("express");
const path = require("path");
const app = require("express")();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const port = process.env.PORT || 4444;

app.use(require("express").urlencoded({ extended: true }));
app.use(require("express").json());

async function connectingToDB() {
  try {
    await require("mongoose").connect(process.env.MONGO, {});
    console.log("Connected to the DB ✅");
  } catch (error) {
    console.log("ERROR: Your DB is not running, start it up ☢️");
  }
}
connectingToDB();
console.log("DEBUG: ADMIN_EMAIL =", process.env.ADMIN_EMAIL);
//==========================================================================
app.use(require("cors")());
// simple request logger for tests
app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.originalUrl}`);
  next();
});

// =========================================================================
// Mount API routes for Person and Family
app.use("/api", require("./routes/routes.js"));
// Mount routes for sending emails
app.use("/email", require("./routes/emailRoutes.js"));
//==========================================================================
// if (process.env.NODE_ENV === "production") {
// console.log("Running in production mode");
const BUILD_PATH = path.join("/app", "client", "dist");
// Serve all static assets (JS, CSS, images) from the build folder
console.log("Static middleware path:", BUILD_PATH);
app.use(express.static(BUILD_PATH));
app.get("/", (req, res) => {
  console.log("Serving index.html for /");
  res.sendFile(path.join(BUILD_PATH, "index.html"));
});
// Add a catch-all route. For any GET request not handled by API routes,
// send the main index.html file. This is crucial for React Router.
app.get("*splat", (req, res) => {
  // Check if the request path starts with our API prefixes.
  // If it does, let the API routes handle it (or return 404 if API routes fail).
  if (
    req.originalUrl.startsWith("/api") ||
    req.originalUrl.startsWith("/email")
  ) {
    return res.status(404).json({ error: "API Route not found" });
  }
  // Otherwise, send the index.html for the client-side app to handle the routing
  res.sendFile(path.join(BUILD_PATH, "index.html"));
});
// }
//==========================================================================
app.listen(port, () => console.log("🚀 Listening on port: " + port + " 🚀"));
