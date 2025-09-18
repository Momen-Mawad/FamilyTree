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
// Mount API routes for Person and Family
app.use("/api", require("./routes/routes.js"));
app.get("/*splat", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});
//==========================================================================
app.listen(port, () => console.log("🚀 Listening on port: " + port + " 🚀"));
