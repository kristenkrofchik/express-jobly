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
  static async findAll

}