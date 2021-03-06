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

    try {
      //findAll method using query string parameters (if applicable)
      const qString = req.query;
      if (q.minSalary !== undefined) q.minSalary = parseInt(q.minSalary);
      const jobs = await Job.findAll(qString);
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });

  //GET a single job by id
  // /[id] => { job }
  // job is { title, salary, equity, companyHandle }
  //authorization required: none

  router.get("/:id", async function (req, res, next) {
    try {
      const job = await Job.get(req.params.id);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

//PATCH a job's data
// /[id] { fld1, fld2 } => { job }
// fields can be { title, salary, equity, companyHandle }
// returns { title, salary, equity, companyHandle }
// authorization required: admin

router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.update(req.params.handle, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });

//DELETE a job
// DELETE /[id] => { deleted: id }
// authorization required: admin

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
      await Job.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
  });
  
  
  module.exports = router;


































































