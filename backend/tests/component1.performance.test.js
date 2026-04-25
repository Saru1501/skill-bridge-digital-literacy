const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { connect, closeDatabase } = require("./setup");

jest.mock("../src/config/db", () => jest.fn().mockResolvedValue(true));

const app = require("../server");

jest.setTimeout(120000);

const artilleryExecutable = path.join(
  __dirname,
  "..",
  "node_modules",
  ".bin",
  process.platform === "win32" ? "artillery.cmd" : "artillery"
);

describe("Component 1 - Artillery Smoke Test", () => {
  let server;
  const port = 3101;
  const reportPath = path.join(__dirname, "artillery-smoke-report.json");

  beforeAll(async () => {
    await connect();
    await app.dbReady;

    await new Promise((resolve) => {
      server = app.listen(port, resolve);
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }

    await closeDatabase();
  });

  test("runs the learning-management Artillery scenario successfully", async () => {
    const overrides = JSON.stringify({
      config: {
        phases: [{ duration: 1, arrivalRate: 1 }],
      },
    });
    const artilleryArgs = [
      "run",
      "--solo",
      "--count",
      "1",
      "-t",
      `http://127.0.0.1:${port}`,
      "--overrides",
      overrides,
      "-o",
      reportPath,
      "artillery.learning.yml",
    ];

    const result = await new Promise((resolve, reject) => {
      const child =
        process.platform === "win32"
          ? spawn("cmd.exe", ["/c", artilleryExecutable, ...artilleryArgs], {
              cwd: path.join(__dirname, ".."),
              stdio: ["ignore", "pipe", "pipe"],
            })
          : spawn(artilleryExecutable, artilleryArgs, {
              cwd: path.join(__dirname, ".."),
              stdio: ["ignore", "pipe", "pipe"],
            });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("error", reject);
      child.on("close", (code) => resolve({ code, stdout, stderr }));
    });

    expect(result.code).toBe(0);
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    expect(report.aggregate.counters["vusers.completed"]).toBeGreaterThan(0);
    expect(report.aggregate.counters["errors.artillery_setup_error"]).toBeUndefined();
  });
});
