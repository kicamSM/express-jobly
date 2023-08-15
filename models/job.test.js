"use strict";

// ! NOTE WHEN RUNNING THIS FILE USING jest job.test.js --verbose the data is not being entered into my jobly_test database. 
// ! When I run company.test.js or user.test.js my database is getting filled including the job data 

const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const db = require("../db.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");



beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** register */
console.log("THIS IS RUNNING!!!!!")
describe("add", function () {
console.log("AND THIS IS RUNNING!!!!!")
  const newJob = {
    id: "3",
    title: "JT3",
    salary: "JS3",
    equity: "JE3",
    handleCompany: "c1",
  };
  console.log("newJob", newJob)
  console.log("AND THIS IS RUNNING!!!!!")
  test("works:", async function () {
    console.log("AND THIS IS NOT!!!!!")
    let job = await Job.add(newJob);
    console.log("job", job)
    const result = await db.query(`SELECT id, title, salary, equity, company_handle AS companyHandle FROM jobs WHERE id = 3`)
    // expect(job).toEqual(newJob);

    expect(result.rows).toEqual([
        {
            id: "3",
            title: "JT3",
            salary: "JS3",
            equity: "JE3",
            handleCompany: "c1",
          }
    ])
    // const found = await db.query("SELECT * FROM jobs WHERE id = 3");
    // expect(found.rows.length).toEqual(1);
    // expect(found.rows[0].handleCompany).toEqual("c1");
    // expect(found.rows[0].salary).toEqual("JS3");
  });

//   test("works: adds admin", async function () {
//     let user = await User.register({
//       ...newUser,
//       password: "password",
//       isAdmin: true,
//     });
//     expect(user).toEqual({ ...newUser, isAdmin: true });
//     const found = await db.query("SELECT * FROM users WHERE username = 'new'");
//     expect(found.rows.length).toEqual(1);
//     expect(found.rows[0].is_admin).toEqual(true);
//     expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
//   });

//   test("bad request with dup data", async function () {
//     try {
//       await User.register({
//         ...newUser,
//         password: "password",
//       });
//       await User.register({
//         ...newUser,
//         password: "password",
//       });
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
});

/************************************** findAll */
// console.log("does this run???")
// // ! this is running
// describe("findAll", function () {
// console.log("!!!!!!!!does this run???")
// // ! this is running
//   test("works", async function () {
//    console.log("blah blah blah blah") 
//     console.log("test is running")
//     // ! these are not running
//     const jobs = await Job.findAll();
//     console.log("jobs:", jobs)
//     expect(jobs).toEqual([
//       {
//         id: "1",
//         title: "U1F",
//         salary: "U1L",
//         equity: "U1E",
//         companyHandle: "c1",
//       },
//       {
//         id: "2",
//         title: "U2F",
//         salary: "U2L",
//         equity: "U2E",
//         companyHandle: "c2",
//       },
//     ]);
//   });
// });

// /************************************** get */

// describe("get", function () {
//   test("works", async function () {
//     let user = await User.get("u1");
//     expect(user).toEqual({
//       username: "u1",
//       firstName: "U1F",
//       lastName: "U1L",
//       email: "u1@email.com",
//       isAdmin: false,
//     });
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.get("nope");
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });

// /************************************** update */

// describe("update", function () {
//   const updateData = {
//     firstName: "NewF",
//     lastName: "NewF",
//     email: "new@email.com",
//     isAdmin: true,
//   };

//   test("works", async function () {
//     let job = await User.update("u1", updateData);
//     expect(job).toEqual({
//       username: "u1",
//       ...updateData,
//     });
//   });

//   test("works: set password", async function () {
//     let job = await User.update("u1", {
//       password: "new",
//     });
//     expect(job).toEqual({
//       username: "u1",
//       firstName: "U1F",
//       lastName: "U1L",
//       email: "u1@email.com",
//       isAdmin: false,
//     });
//     const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
//     expect(found.rows.length).toEqual(1);
//     expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.update("nope", {
//         firstName: "test",
//       });
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("bad request if no data", async function () {
//     expect.assertions(1);
//     try {
//       await User.update("c1", {});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

/************************************** remove */

// describe("remove", function () {
//   test("works", async function () {
//     await User.remove("u1");
//     const res = await db.query(
//         "SELECT * FROM users WHERE username='u1'");
//     expect(res.rows.length).toEqual(0);
//   });

//   test("not found if no such user", async function () {
//     try {
//       await User.remove("nope");
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });
