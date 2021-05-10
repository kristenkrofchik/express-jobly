"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {

//create a job from data, update db, and return new job data.
//data should be { title, salary, equity, company_handle }
//returns { title, salary, equity, company_handle }

    static async create({ title, salary, equity, company_handle }) {
    
      const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING title, salary, equity, company_handle AS "companyHandle"`,
        [
          title,
          salary,
          equity,
          company_handle,
        ],
    );
    const job = result.rows[0];

    return job;
  }

  //Find all jobs
  //returns [{ title, salary, equity, company_handle }, ...]
  //add searchFilters object as paramter {minSalary: 10000, hasEquity: false, ...}
  static async findAll(searchFilters = {}) {
    const query = await db.query(
      `SELECT title, 
              salary,
              equity,
              company_handle AS companyHandle
      FROM jobs`)

    let whereStatements = [];
    let queryValues = [];

    const { title, minSalary, hasEquity } = searchFilters;

    //we add the query string values to the queryValues array and we add necessary WHERE expressions to the whereStatements array.

    if(minSalary !== undefined) {
      queryValues.push(minSalary);
      whereStatements.push(`minSalary >= $${queryValues.length}`);
    }
    if(hasEquity !== undefined) {
      queryValues.push(hasEquity);
      whereStatements.push(`hasEquity = $${queryValues.length}`);
    }
    if(title) {
      queryValues.push(title);
      whereStatements.push(`name ILIKE $${queryValues.length}`);
    }

    if (whereStatements.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    //last formatting for query and return results of query
    query += " ORDER BY title";
    const jobsRes = await db.query(query, queryValues);
    return jobsRes.rows;
    }



    
}

