"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Job {

  /** Add job with data.
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async add({ title, salary, equity, companyHandle }) {
    const duplicateCheck = await db.query(
          `SELECT title
           FROM jobs
           WHERE title = $1`,
        [title],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate title: ${title}`);
    }

    const result = await db.query(
          `INSERT INTO jobs
           (title,
            salary,
            equity,
            company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          title,
          salary,
          equity,
          companyHandle
        ],
    );

    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ id, title, salary, equity, companyHandle }, ...]
   **/

  static async findAll() {
    console.log("findAll is running")
    const result = await db.query(
          `SELECT id,
                  title,
                  salary, 
                  equity, 
                  company_handle AS companyHandle
           FROM jobs
           ORDER BY id`,
    );

    return result.rows;
  }

  /** Given an id, return data about job.
   *
   * Returns  { job: { id, title, salary, equity, companyHandle } }
   *
   * Throws NotFoundError if job not found.
   **/

  static async get(id) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
        [id],
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { title, salary, equity }
   *
   * Returns  { job: { id, title, salary, equity, companyHandle } }
   *
   * Throws NotFoundError if not found.
   * 
   */

  static async update(id, data) {

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          title: "title",
          salary: "salary",
          equity: "equity",
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                                title,
                                salary,
                                equity`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
          `DELETE
           FROM jobs
           WHERE id = $1
           RETURNING id`,
        [id],
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id: ${id}`);
  }
}


module.exports = Job;
