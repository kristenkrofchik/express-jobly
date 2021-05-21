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
      equity: "0.1",
      companyHandle: "c1",
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
            equity: "200",
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
                id: expect.any(Number),
                title: "j1",
                salary: 100000,
                equity: "0.1",
                companyHandle: "c1" 
              },
              {
                id: expect.any(Number),
                title: "j2",
                salary: 200000,
                equity: "0.2",
                companyHandle: "c2" 
              },
              {
                id: expect.any(Number),
                title: "j3",
                salary: 35000,
                companyHandle: "c3" 
              },
            ],
      });
    });
    test("ok for anon, with filters", async function() {
      const resp = await request(app).get('/jobs').query({hasEquity: false, title: '3'});
      expect(resp.body).toEqual({
        jobs:
          [
            {
              id: expect.any(Number),
              title: "j3",
              salary: 35000,
              companyHandle: "c3" 
            },
          ],
      });
    });
  
    test("fails: test next() handler", async function () {
      // there's no normal failure event which will cause this route to fail ---
      // thus making it hard to test that the error-handler works with it. This
      // should cause an error, all right :)
      await db.query("DROP TABLE jobs CASCADE");
      const resp = await request(app)
          .get("/jobs")
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(500);
    });
  });



























\