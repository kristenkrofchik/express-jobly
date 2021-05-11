"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//test create job

describe("create", function () {
    const newJob = {
      title: "new",
      salary: 40500,
      equity: 0,
      companyHandle: 'jackson-sons'
    };
  
    test("works", async function () {
      let job = await Company.create(newJob);
      expect(job).toEqual(newJob);
  
      const result = await db.query(
            `SELECT title, salary, equity, company_handle
             FROM jobs
             WHERE title = 'new'`);
      expect(result.rows).toEqual([
        {
          title: "new",
          salary: 40500,
          equity: 0,
          company_handle: 'jackson-sons'
        },
      ]);
    });
  
    test("bad request with dupe", async function () {
      try {
        await Job.create(newJob);
        await Job.create(newJob);
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });