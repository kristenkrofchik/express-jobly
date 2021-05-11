"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {

//create a job from data, update db, and return new job data.
//data should be { title, salary, equity, company_handle }
//returns { title, salary, equity, companyHandle }

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
  //returns [{ title, salary, equity, companyHandle }, ...]
  //add searchFilters object as paramter {minSalary: 10000, hasEquity: false, ...}
  static async findAll(searchFilters = {}) {
    const query = await db.query(
      `SELECT title, 
              salary,
              equity,
              company_handle AS "companyHandle"
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

    //given an individual job title, return data about that job
    //returns {title, salary, equity, companyHandle}
    //throws NotFoundError if not found
    static async get(id) {
      const jobRes = await db.query(
            `SELECT title,
                    salary,
                    equity,
                    company_handle AS "companyHandle"
             FROM jobs
             WHERE id = $1`,
          [id]);
  
      const job = jobRes.rows[0];
  
      if (!job) throw new NotFoundError(`No job: ${id}`);
  
      return job;
    }

    //partial update- update job with provided data. only changes data that is provided.
    //data can include {title, salary, equity, companyHandle}
    //returns {id, title, salary, equity, companyHandle}
    //throws NotFoundError if not found

    static async update(handle, data) {
      const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          companyHandle: "company_handle",
        });
      const handleVarIdx = "$" + (values.length + 1);
      
      const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity, 
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, handle]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
    }






















































}

