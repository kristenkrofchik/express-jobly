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

  //test findAll jobs

  describe("findAll", function () {
    test("works: no filter", async function () {
      let jobs = await Job.findAll();
      expect(jobs).toEqual([
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
      ]);
    });
    test("works: minEmployees filter", async function() {
      let companies = await Company.findAll({minEmployees: 3});
      expect(companies).toEqual([
        {
          handle: "c3",
          name: "C3",
          description: "Desc3",
          numEmployees: 3,
          logoUrl: "http://c3.img",
        },
      ]);
    });
    test("works: maxEmployees filter", async function() {
      let companies = await Company.findAll({maxEmployees: 1});
      expect(companies).toEqual([
        {
          handle: "c1",
          name: "C1",
          description: "Desc1",
          numEmployees: 1,
          logoUrl: "http://c1.img",
        },
      ]);
    });
    test("works: name filter", async function() {
      let companies = await Company.findAll({name: '3'});
      expect(companies).toEqual([
        {
          handle: "c3",
          name: "C3",
          description: "Desc3",
          numEmployees: 3,
          logoUrl: "http://c3.img",
        },
      ]);
    });
    test("works: minEmployees filter and name filter", async function() {
      let companies = await Company.findAll({minEmployees: 3, name: 'C'});
      expect(companies).toEqual([
        {
          handle: "c3",
          name: "C3",
          description: "Desc3",
          numEmployees: 3,
          logoUrl: "http://c3.img",
        },
      ]);
    })
  });