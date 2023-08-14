"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Company {
  /** Create a company (from data), update db, return new company data.
   *
   * data should be { handle, name, description, numEmployees, logoUrl }
   *
   * Returns { handle, name, description, numEmployees, logoUrl }
   *
   * Throws BadRequestError if company already in database.
   * */

  static async create({ handle, name, description, numEmployees, logoUrl }) {
    const duplicateCheck = await db.query(
          `SELECT handle
           FROM companies
           WHERE handle = $1`,
        [handle]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate company: ${handle}`);

    const result = await db.query(
          `INSERT INTO companies
           (handle, name, description, num_employees, logo_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"`,
        [
          handle,
          name,
          description,
          numEmployees,
          logoUrl,
        ],
    );
    const company = result.rows[0];

    return company;
  }

  /** Find all companies.
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAll(data) {
    console.log("data['minEmployees']:", data["minEmployees"])
    console.log("data['maxEmployees']:", data["maxEmployees"])
    console.log("RESULT data['maxEmployees'] < data['minEmployees']:", data["maxEmployees"] < data["minEmployees"])
    
    if(data.hasOwnProperty("minEmployees") && data.hasOwnProperty("maxEmployees") && data["minEmployees"] > data["maxEmployees"]) {
      throw new ExpressError('Minimum employees cannot be greater than maximum employees', 400)
    }

    let compQuery = `SELECT handle,
    name,
    description,
    num_employees AS "numEmployees",
    logo_url AS "logoUrl" 
    FROM companies`

    // let newCompQuery = compQuery + " WHERE"
    // console.log("newCompQuery:", newCompQuery)

    if(Object.keys(data).length === 0) {
    let companiesRes = await db.query(compQuery)

      // console.log("IF STATEMENT IS RUNNING")
      // const companiesRes = await db.query(
      //   // `SELECT * 
      //   // FROM companies`);
      //   `SELECT handle,
      //      name,
      //      description,
      //      num_employees AS "numEmployees",
      //      logo_url AS "logoUrl" 
      //      FROM companies`);
      
      return companiesRes.rows;

    } else {
        let newCompQuery = compQuery + " WHERE"
        console.log("newCompQuery:", newCompQuery)
        let newName = ` ILIKE '%${data["name"]}%'`
        let formattedObj = {};
        console.log("data:", data)

        for (const [key, value] of Object.entries(data)) {
          if (key === "name") {
            formattedObj[key] = newName;
          } else {
            formattedObj[key] = value;
          }
        }
        const keys = await Object.keys(formattedObj);
        console.log("keys:", keys)
        const values = await Object.values(formattedObj);
        console.log("values:", values)

        console.log("formattedObj:", formattedObj)

        const jsStrings = keys.map((key, index) => {
          if(key === "name") {
            return ` ${key}${values[index]}`
          }
          return ` ${key}=${values[index]}`;
        });

        console.log("jsstrings:", jsStrings)
        
     

        let sqlString = jsStrings.join(' AND ');
        console.log('sqlString:', sqlString); 
        
        if(sqlString.includes('minEmployees')) {
          
          sqlString = sqlString.replace('minEmployees=','num_employees > ')
        }
        if(sqlString.includes('maxEmployees')) {
          
          sqlString = sqlString.replace('maxEmployees=','num_employees <')
        }


        // ! will need to recheck the query the goal is all comapnies where name=name, minEmployees=minEmployees, maxEmployees=maxEmployees WHERE name LIKE '%name%' 

        // ! note you are having a hard time getting the query to return from a name qhich doesnt make any sense.
        const companiesRes = await db.query(
          newCompQuery + sqlString)
          console.log("companiesRes:", companiesRes)
            // `SELECT handle,
            //         name,
            //         description,
            //         num_employees AS "numEmployees",
            //         logo_url AS "logoUrl" 
            //   FROM companies WHERE ${sqlString}`);
            
        //       `SELECT handle,
        //       name,
        //       description,
        //       num_employees AS "numEmployees",
        //       logo_url AS "logoUrl"
        // FROM companies WHERE name ILIKE '%smith%' AND num_employees > 500`);

              // const companiesRes = await db.query(
              //   `SELECT handle,
              //           name,
              //           description,
              //           num_employees AS "numEmployees",
              //           logo_url AS "logoUrl" 
              //     FROM companies WHERE name='Bauer-Gallagher'`);
        

    

    //        `SELECT handle,
    //        name,
    //        description,
    //        num_employees AS "numEmployees",
    //        logo_url AS "logoUrl" 
    //  FROM companies
    //  WHERE (${joinedString})
    //    RETURNING
    //    handle,
    //    name,
    //    description,
    //    num_employees AS "numEmployees",
    //    logo_url AS "logoUrl" 
    //   ORDER BY name`);



    // const result = await db.query(querySql, [...values, handle]);
      //  return "This is returning"
    // return result.rows;
    return companiesRes.rows;
  }}

  /** Given a company handle, return data about company.
   *
   * Returns { handle, name, description, numEmployees, logoUrl, jobs }
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(handle) {
    const companyRes = await db.query(
          `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
        [handle]);

    const company = companyRes.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Update company data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {name, description, numEmployees, logoUrl}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

  static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          numEmployees: "num_employees",
          logoUrl: "logo_url",
        });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;
    const result = await db.query(querySql, [...values, handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);

    return company;
  }

  /** Delete given company from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(handle) {
    const result = await db.query(
          `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
        [handle]);
    const company = result.rows[0];

    if (!company) throw new NotFoundError(`No company: ${handle}`);
  }
}


module.exports = Company;
