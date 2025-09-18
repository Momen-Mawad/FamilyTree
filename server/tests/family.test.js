const axios = require("axios");
const { spawn } = require("child_process");
const path = require("path");
const mongoose = require("mongoose");

const TEST_DB =
  process.env.MONGO_TEST || "mongodb://localhost:27017/familytree_test";
const BASE = "http://localhost:4444/api";

let serverProcess;

const waitForServer = async (url, timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await axios.get(url);
      return;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error("Server did not start in time");
};

describe("Family API", () => {
  let familyId;

  beforeAll(async () => {
    // start the server with TEST_DB
    serverProcess = spawn("node", [path.join(__dirname, "..", "index.js")], {
      env: { ...process.env, PORT: "4444", MONGO: TEST_DB },
      stdio: ["ignore", "pipe", "pipe"],
    });

    // forward server logs for better test output
    if (serverProcess.stdout)
      serverProcess.stdout.on("data", (d) =>
        process.stdout.write(`[server] ${d}`),
      );
    if (serverProcess.stderr)
      serverProcess.stderr.on("data", (d) =>
        process.stderr.write(`[server] ${d}`),
      );

    // wait for server and connect test process to DB for cleanup
    await waitForServer(`${BASE}/families`);
    await mongoose.connect(TEST_DB);
    await mongoose.connection.dropDatabase();
  }, 15000);

  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    } catch (e) {
      // ignore
    }
    if (serverProcess) serverProcess.kill();
  });

  it("should create a family", async () => {
    const res = await axios.post(`${BASE}/families`, { familyName: "Smith" });
    expect(res.status).toBe(201);
    expect(res.data.familyName).toBe("Smith");
    familyId = res.data._id;
  });

  it("should get all families", async () => {
    const res = await axios.get(`${BASE}/families`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("should get a family by id", async () => {
    const res = await axios.get(`${BASE}/families/${familyId}`);
    expect(res.status).toBe(200);
    expect(res.data.familyName).toBe("Smith");
  });

  it("should update a family", async () => {
    const res = await axios.put(`${BASE}/families/${familyId}`, {
      familyName: "Johnson",
    });
    expect(res.status).toBe(200);
    expect(res.data.familyName).toBe("Johnson");
  });

  it("should delete a family", async () => {
    const res = await axios.delete(`${BASE}/families/${familyId}`);
    expect(res.status).toBe(200);
    expect(res.data.message).toMatch(/Family .* deleted/);
  });
});
