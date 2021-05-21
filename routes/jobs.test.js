"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//POST jobs
describe("POST /jobs", function () {
    const newJob = {
      title: "new",
      salary: 85000,
      equity: 0.1,
      company_handle: "c1",
    };
  
    test("ok for admin", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send(newJob)
          .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
        job: newJob,
      });
    });
  
    test("bad request with missing data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            title: "new",
            salary: 10000,
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
  
    test("bad request with invalid data", async function () {
      const resp = await request(app)
          .post("/jobs")
          .send({
            ...newJob,
            equity: 200,
          })
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
    });
  });

  //GET /jobs

  describe("GET /jobs", function () {
    test("ok for anon", async function () {
      const resp = await request(app).get("/jobs");
      expect(resp.body).toEqual({
        jobs:
            [
              {
                handle: "c1",
                name: "C1",
                description: "Desc1",
                numEmployees: 1,
                logoUrl: "http://c1.img",
              },
              {
                handle: "c2",
                name: "C2",
                description: "Desc2",
                numEmployees: 2,
                logoUrl: "http://c2.img",
              },
              {
                handle: "c3",
                name: "C3",
                description: "Desc3",
                numEmployees: 3,
                logoUrl: "http://c3.img",
              },
            ],
      });
    });
    test("ok for anon, with filters", async function() {
      const resp = await request(app).get('/companies').query({minEmployees: 2, name: '3'});
      expect(resp.body).toEqual({
        companies:
          [
            {
              handle: "c3",
              name: "C3",
              description: "Desc3",
              numEmployees: 3,
              logoUrl: "http://c3.img",
            },
          ],
      });
    });
  
    test("fails: test next() handler", async function () {
      // there's no normal failure event which will cause this route to fail ---
      // thus making it hard to test that the error-handler works with it. This
      // should cause an error, all right :)
      await db.query("DROP TABLE companies CASCADE");
      const resp = await request(app)
          .get("/companies")
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(500);
    });
  });



























\