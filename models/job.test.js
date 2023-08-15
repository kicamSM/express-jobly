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
describe("add", function () {
  const newJob = {
    title: "JT3",
    salary: 3000,
    companyHandle: "c1"
  };

  test("works:", async function () {
    let job = await Job.add(newJob);
    const result = await db.query(`SELECT id, title, salary, equity, company_handle AS "companyHandle" FROM jobs WHERE id = 3`)
    expect(result.rows).toEqual(
        [{
            id: 3,
            title: "JT3",
            salary: 3000,
            equity: null,
            companyHandle: 'c1' 
          }]
    )
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].companyHandle).toEqual("c1");
    expect(result.rows[0].id).toEqual(3);
  });

  test("error: dup data", async function () {
    const job1 = {
        id: 1,
        title: "J1T",
        salary: 1000,
        equity: '0.1', 
        companyHandle: 'c1'
    }
    try {
      let job = await Job.add(job1)
      } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

// *note havent tested these yet

// describe("findAll", function () {
//   test("works:", async function () {
//     const jobs = await Job.findAll();
//     console.log("jobs:", jobs)
//     expect(jobs).toEqual([
//       {
//         id: "1",
//         title: "U1F",
//         salary: "1000",
//         equity: "0.1",
//         companyHandle: "c1",
//       },
//       {
//         id: "2",
//         title: "U2F",
//         salary: "5000",
//         equity: "0.2",
//         companyHandle: "c2",
//       },
//     ]);
//   });

//   test("works: with title", async function () {
//     let data = {title: "U2F"}
//     const jobs = await Job.findAll(data);
//     console.log("jobs:", jobs)
//     expect(jobs).toEqual([
//       {
//         id: "2",
//         title: "U2F",
//         salary: "5000",
//         equity: "0.2",
//         companyHandle: "c2",
//       },
//     ]);
//   });

//   test("works: with equity", async function () {
//     let data = {equity: "true"}
//     const jobs = await Job.findAll(data);
//     console.log("jobs:", jobs)
//     expect(jobs).toEqual([
//       {
//         id: "2",
//         title: "U2F",
//         salary: "U2L",
//         equity: "U2E",
//         companyHandle: "c2",
//       },
//     ]);
//   });

//   test("works: with equity true", async function () {
//     let data = {equity: "true"}
//     const jobs = await Job.findAll(data);
//     console.log("jobs:", jobs)
//     expect(jobs).toEqual([
//       {
//         id: "1",
//         title: "U1F",
//         salary: "1000",
//         equity: "0.1",
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

//   test("works: with equity false", async function () {
//     let data = {equity: "false"}
//     const jobs = await Job.findAll(data);
//     console.log("jobs:", jobs)
//     expect(jobs).toEqual([
//     ]);
//   });

//   test("works: with salary", async function () {
//     let data = {salary: 1000}
//     const jobs = await Job.findAll(data);
//     console.log("jobs:", jobs)
//     expect(jobs).toEqual([
//       {
//         id: "1",
//         title: "U1F",
//         salary: "1000",
//         equity: "0.1",
//         companyHandle: "c1",
//       },
//     ]);
//   });
  
// });



// /************************************** get */

// *note havent tested these yet

// describe("get", function () {
//   test("works:", async function () {
//     let job = await Job.get(1);
//     expect(job).toEqual({
//       id: 1,
//       title: "J1T",
//       salary: 1000,
//       equity: '0.1', 
//       companyHandle: 'c1'
//   });
//   });

//   test("not found if no such job", async function () {
//     try {
//       await User.get(0);
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });
// });

// /************************************** update */
// * note havent tried these yet. 

// describe("update", function () {
//   const updateData =  {
//             title: "U2F",
//             salary: "2000",
//             equity: "0.2",
//           };

//   test("works", async function () {
//     let job = await Job.update("2", updateData);
//     expect(job).toEqual({
//           id: "2",
//           title: "U2F",
//           salary: "2000",
//           equity: "0.2",
//           companyHandle: "c2"
//     });
//   });

//   test("error: not found if no such job", async function () {
//     try {
//       await Job.update(0, {
//         salary: 2000
//       });
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("error: bad request if no data", async function () {
//     expect.assertions(1);
//     try {
//       await Job.update(1, {});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });

//   test("error: bad request update id", async function () {
//     try {
//       await Job.update(1, {id: 8});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });

//   test("error: bad request update companyHandle", async function () {
//     try {
//       await Job.update(1, {companyHandle: 'c2'});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });

// });

/************************************** remove */

describe("remove", function () {
  test("works:", async function () {
    await Job.remove("1");
    const res = await db.query(
        "SELECT * FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
    let allJobs = await db.query(`SELECT id FROM jobs`);
    expect(allJobs.rows.length).toEqual(1)
  });

  test("error: not found if no such job id", async function () {
    try {
      await User.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
