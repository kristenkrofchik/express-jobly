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
          title: "job1",
          salary: 100000,
          equity: 0,
          companyHandle: 'c1'
        },
        {
          title: "job2",
          salary: 50000,
          equity: 0,
          companyHandle: 'c2'
        },
      ]);
    });
    test("works: minSalary filter", async function() {
      let jobs = await Job.findAll({minSalary: 60000});
      expect(jobs).toEqual([
        {
          title: "job1",
          salary: 100000,
          equity: 0,
          companyHandle: 'c1'
        },
      ]);
    });
    test("works: hasEquity filter", async function() {
      let jobs = await Company.findAll({hasEquity: false});
      expect(jobs).toEqual([
        {
          title: "job1",
          salary: 100000,
          equity: 0,
          companyHandle: 'c1'
        },
        {
          title: "job2",
          salary: 50000,
          equity: 0,
          companyHandle: 'c2'
        },
      ]);
    });
    test("works: title filter", async function() {
      let jobs = await Job.findAll({name: '2'});
      expect(jobs).toEqual([
        {
          title: "job2",
          salary: 50000,
          equity: 0,
          companyHandle: 'c2'
        },
      ]);
    });
    test("works: minSalary filter and title filter", async function() {
      let jobs = await Job.findAll({minSalary: 30000, name: '1'});
      expect(jobs).toEqual([
        {
          title: "job1",
          salary: 100000,
          equity: 0,
          companyHandle: 'c1'
        },
      ]);
    })
  });

  //test get route for single job

describe("get", function () {
    test("works", async function () {
      let job = await Job.get(testJobIds[0]);
      expect(job).toEqual({
        title: "job1",
        salary: 100000,
        equity: 0,
        companyHandle: 'c1',
      });
    });
  
    test("not found if no such company", async function () {
      try {
        await Job.get(4500789);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  ///TO DOOOOOOOOOOOOO
  /************************************** update */

describe("update", function () {
    const updateData = {
      name: "New",
      description: "New Description",
      numEmployees: 10,
      logoUrl: "http://new.img",
    };
  
    test("works", async function () {
      let company = await Company.update("c1", updateData);
      expect(company).toEqual({
        handle: "c1",
        ...updateData,
      });
  
      const result = await db.query(
            `SELECT handle, name, description, num_employees, logo_url
             FROM companies
             WHERE handle = 'c1'`);
      expect(result.rows).toEqual([{
        handle: "c1",
        name: "New",
        description: "New Description",
        num_employees: 10,
        logo_url: "http://new.img",
      }]);
    });
  
    test("works: null fields", async function () {
      const updateDataSetNulls = {
        name: "New",
        description: "New Description",
        numEmployees: null,
        logoUrl: null,
      };
  
      let company = await Company.update("c1", updateDataSetNulls);
      expect(company).toEqual({
        handle: "c1",
        ...updateDataSetNulls,
      });
  
      const result = await db.query(
            `SELECT handle, name, description, num_employees, logo_url
             FROM companies
             WHERE handle = 'c1'`);
      expect(result.rows).toEqual([{
        handle: "c1",
        name: "New",
        description: "New Description",
        num_employees: null,
        logo_url: null,
      }]);
    });
  
    test("not found if no such company", async function () {
      try {
        await Company.update("nope", updateData);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request with no data", async function () {
      try {
        await Company.update("c1", {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });
  
  /************************************** remove */
  
  describe("remove", function () {
    test("works", async function () {
      await Company.remove("c1");
      const res = await db.query(
          "SELECT handle FROM companies WHERE handle='c1'");
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such company", async function () {
      try {
        await Company.remove("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });