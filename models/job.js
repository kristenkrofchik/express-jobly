"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {

//create a job from data, update db, and return new job data.
//data should be { title, }

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary INTEGER CHECK (salary >= 0),
    equity NUMERIC CHECK (equity <= 1.0),
    company_handle VARCHAR(25) NOT NULL
      REFERENCES companies ON DELETE CASCADE
  );


}