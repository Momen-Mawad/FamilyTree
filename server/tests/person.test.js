const axios = require("axios");
const { spawn } = require("child_process");
const path = require("path");
const mongoose = require("mongoose");

const TEST_DB =
  process.env.MONGO_TEST || "mongodb://localhost:27017/familytree_test";
const BASE = "http://localhost:4444/api";

let serverProcess;
let familyId;
let personId;

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

describe("Person API", () => {
  beforeAll(async () => {
    serverProcess = spawn("node", [path.join(__dirname, "..", "index.js")], {
      env: { ...process.env, PORT: "4444", MONGO: TEST_DB },
      stdio: ["ignore", "pipe", "pipe"],
    });

    if (serverProcess.stdout)
      serverProcess.stdout.on("data", (d) =>
        process.stdout.write(`[server] ${d}`),
      );
    if (serverProcess.stderr)
      serverProcess.stderr.on("data", (d) =>
        process.stderr.write(`[server] ${d}`),
      );

    await waitForServer(`${BASE}/families`);
    await mongoose.connect(TEST_DB);
    await mongoose.connection.dropDatabase();
    // create a family to use
    const fam = await axios.post(`${BASE}/families`, { familyName: "Doe" });
    familyId = fam.data._id;
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

  it("should create a person", async () => {
    const res = await axios.post(`${BASE}/persons`, {
      name: "John Doe",
      gender: "male",
      family: familyId,
    });
    expect(res.status).toBe(201);
    expect(res.data.name).toBe("John Doe");
    personId = res.data._id;
  });

  it("should get all persons", async () => {
    const res = await axios.get(`${BASE}/persons`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("should get a person by id", async () => {
    const res = await axios.get(`${BASE}/persons/${personId}`);
    expect(res.status).toBe(200);
    expect(res.data.name).toBe("John Doe");
  });

  it("should update a person", async () => {
    const res = await axios.put(`${BASE}/persons/${personId}`, {
      name: "Jane Doe",
      gender: "female",
      family: familyId,
    });
    expect(res.status).toBe(200);
    expect(res.data.name).toBe("Jane Doe");
  });

  it("should delete a person", async () => {
    const res = await axios.delete(`${BASE}/persons/${personId}`);
    expect(res.status).toBe(200);
    expect(res.data.message).toBe("Person deleted");
  });
});
