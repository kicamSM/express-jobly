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

// *ensureLoggedIn is authorization and ensureAdmin is also authorization

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

// *no authorization required for this 

router.get("/", async function (req, res, next) {
  const { name, minEmployees, maxEmployees } = req.query; 

  try {
    // ? this next two chunks of code seem reduntant and seem like I should be able to condense them? Maybe I am wrong
    
    if (minEmployees !== undefined) {
      if(minEmployees.includes('-') === true) {
        throw new ExpressError("Minimum employees must be a positive number!", 400);
      }
      // *handling negative numbers
    }
    if(maxEmployees !== undefined ) {
      if(maxEmployees.includes('-') === true) {
          throw new ExpressError("Maximum employees must be a positive number!", 400);
      }
      // *handling negative numbers
    }
    let data = {"name": name, "minEmployees": Math.floor(parseInt(minEmployees)), "maxEmployees": Math.floor(parseInt(maxEmployees))}
    // *creating object data turning MaxEmployees and minEmployees to integer and rounding them

    for(let value in data) {
      if(data[value] === undefined || typeof data[value] !== "string" && isNaN(data[value]) === true) {
        delete data[value]
      }
      

      // ! Note that you fixed this. You had put if NaN which didnt work because it was deleting name
      // *gettning rid of any values that dont match criteria i.e. minEmployees must be a number and
    }
    const companies = await Company.findAll(data);

    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { "company": {handle, name, description, numEmployees, logoUrl,  "jobs": [{ title, salary, equity }, ...] }
 *
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {

  try {
    const company = await Company.getCompJobs(req.params.handle)

    return res.json({ company });
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
 * *Authorization required: loggedIn and isAdmin
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
 *  *Authorization required: loggedIn and isAdmin
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
