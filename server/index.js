const app = require("express")();
require("dotenv").config();
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

//==========================================================================
app.use(require("cors")());
// simple request logger for tests
app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.originalUrl}`);
  next();
});
//==========================================================================
if (process.env.NODE_ENV === "production") {
  const BUILD_PATH = path.join(__dirname, "..", "client", "dist");

  // 1. Serve all static assets (JS, CSS, images) from the build folder
  app.use(express.static(BUILD_PATH));

  // 2. Add a catch-all route. For any GET request not handled by API routes,
  // send the main index.html file. This is crucial for React Router.
  app.get("*", (req, res) => {
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
}
//==========================================================================
// Mount API routes for Person and Family
app.use("/api", require("./routes/routes.js"));
// Mount routes for sending emails
app.use("/email", require("./routes/emailRoutes.js"));
// Catch-all route for handling 404 errors
app.get("/*splat", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});
//==========================================================================
app.listen(port, () => console.log("🚀 Listening on port: " + port + " 🚀"));
