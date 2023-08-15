"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureAdmin, ensureUsersAccountOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = express.Router();


/** POST / { job}  => { job }
 *
 * Adds a new job.This is only for admin users to add jobs.
 *
 * This returns the newly created job.
 *  { job: { id, title, salary, equity, companyHandle} }
 *
 * Authorization required: admin
 **/

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.add(req.body);
      return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** GET / => { jobs: [ {id, title, salary, equity }, ... ] }
   *
   * Returns list of all jobs.
   *
   * Authorization required: none
   **/
  
  router.get("/", async function (req, res, next) {
    // console.log("router.get('/', async function is running")
    let { title,  salary, equity } = req.query;
    // console.log("equity", equity)
    // console.log("equity !== 'true'", equity !== "true")
    // console.log("equity !== 'false'", equity !== "false")
    // console.log(equity === undefined)

  // ! need to fix this still 
    
    if(!equity) {
      equity = "false"
    }

  console.log("typeof(equity)", typeof(equity))

    try {
      if(equity === "true") {
        console.log("equity is true")
      }
      if(equity === "false") {
        console.log("equity is false")
      }
      // if(equity === undefined) {
      //   console.log("equity is undefined")
      // }
      // console.log("req.query", req.query)
      // if(req.query.equity === undefined)
      // let queryData = req.query
      // if(equity in queryData) {
      //   console.log("equity is in req.query")
      // }
     console.log("equity", equity)
      if(equity !== "true" && equity !== "false") {
        throw new BadRequestError("Equity must be a boolean!", 400);
      }  

      // if(!Boolean(equity)) {
      //   throw new BadRequestError("Equity must be a boolean!", 400);
      // }

      let data = {"title": title, "salary": parseInt(salary), "equity": equity}
      // console.log("data:", data)

      for(let value in data) {
        if(data[value] === undefined) {
          delete data[value]
        }

        if(isNaN(data["salary"]) === true) {
            console.log("if statement is running")
            delete data["salary"]
        }
      }

      // console.log("data2:", data)
      const jobs = await Job.findAll(data);
      return res.json({ jobs });
    // } catch (err) {
    //   return next(err);
    
   } catch (err) {
        return next(err);
      }
  });
  
  
  /** GET /[id] => { job }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Authorization required: none
   **/
  
  router.get("/:id", async function (req, res, next) {
    console.log('router.get("/:id", is running')
    console.log("req.params.username:", req.params.id)
    try {
      const job = await Job.get(req.params.id);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** PATCH /[id] { job } => { job }
   *
   * Data can include:
   *   { title, salary, equity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Authorization required: admin
   **/
  
  router.patch("/:id", ensureAdmin, async function (req, res, next) {
    console.log("router.patch('/:id' is running")
    try {
      const validator = jsonschema.validate(req.body, jobUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.update(req.params.id, req.body);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });
  
  
  /** DELETE /[id]  =>  { deleted: id }
   *
   * Authorization required: admin. 
   **/
  
  router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
      await Job.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
  });
  
  
  module.exports = router;
  