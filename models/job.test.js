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

  //test update a single job

describe("update", function () {
    const updateData = {
      title: "newJob",
      salary: "78000",
      equity: 0.1,
      companyHandle: "c3",
    };
  
    test("works", async function () {
      let job = await Job.update(testJobIds[0], updateData);
      expect(job).toEqual({
        id: testJobIds[0],
        ...updateData,
      });
  
    test("not found if no such job", async function () {
      try {
        await Job.update(3333333, updateData);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request with no data", async function () {
      try {
        await Job.update(testJobIds[0], {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });
  
  //test remove a single job
  
  describe("remove", function () {
    test("works", async function () {
      await Job.remove(testJobIds[0]);
      const res = await db.query(
          `SELECT id FROM jobss WHERE id=$1`, [testJobIds[0]]);
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such company", async function () {
      try {
        await Job.remove(44444444);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
