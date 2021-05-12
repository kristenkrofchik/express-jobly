"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();

//POST a job.
//{ job } => { job }
//job should be { title, salary, equity, companyHandle }
//returns { title, salary, equity, companyHandle }
//authorization required: admin

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.create(req.body);
      return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });

//GET all jobs
//{ jobs: [ { title, salary, equity, companyHandle }, ...] }}
//can filter on: title, minSalary, hasEquity
//authorization required: none

router.get("/", async function (req, res, next) {
    //get any info from query string. convert minSalary to integer from strings (if applicable)
    const qString = req.query;
    if (q.minSalary !== undefined) q.minSalary = parseInt(q.minSalary);
  
    try {
      //findAll method using query string parameters (if applicable)
      const jobs = await Job.findAll(qString);
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });






















