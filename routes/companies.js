"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, ExpressError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Company = require("../models/company");

const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();


/** POST / { company } =>  { company }
 *
 * company should be { handle, name, description, numEmployees, logoUrl }
 *
 * Returns { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: login
 */

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * - will throw error on negative numbers if passed in as minEmployee or maxEmployee 
 * - will handle decimal numbers by flooring them if passed in as minEmployee or maxEmployee
 * - will handle an extra items in query string not pass them to models
 * 
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const { name, minEmployees, maxEmployees } = req.query; 
  try {
    if (minEmployees !== undefined) {
      if(minEmployees.includes('-') === true) {
        throw new ExpressError("Minimum employees must be a positive number!", 400);
      }
    }
    if(maxEmployees !== undefined ) {
      if(maxEmployees.includes('-') === true) {
          throw new ExpressError("Maximum employees must be a positive number!", 400);
      }
    }
    let data = {"name": name, "minEmployees": Math.floor(parseInt(minEmployees)), "maxEmployees": Math.floor(parseInt(maxEmployees))}

    for(let value in data) {
      if(data[value] === undefined || isNaN(data[value]) === true) {
        delete data[value]
      }
    }

    const companies = await Company.findAll(data);

    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { "company": {handle, name, description, numEmployees, logoUrl}, "jobs": [{ title, salary, equity }, ...] }
 *
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {

  try {
    const Results = await Company.getCompJobs(req.params.handle)

    return res.json({ Results });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: login
 */

router.patch("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  console.log("patch route is running")
//  console.log("req", req.body)
  try {
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: login
 */

router.delete("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
