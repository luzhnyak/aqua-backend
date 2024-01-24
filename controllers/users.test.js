const mongoose = require("mongoose");
require("dotenv").config();

const { loginUser } = require("./users");

const { DB_HOST } = process.env;

const req = { body: { email: "oleg@gmail.com", password: "11111111" } };
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("############## Test loginUser controller", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Check status 200", async () => {
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("Check token", async () => {
    await loginUser(req, res);
    expect(typeof res.json.mock.calls[0][0].token).toBe("string");
  });

  test("Check user", async () => {
    await loginUser(req, res);
    expect(typeof res.json.mock.calls[0][0].user.email).toBe("string");
    expect(typeof res.json.mock.calls[0][0].user.subscription).toBe("string");
  });
});
