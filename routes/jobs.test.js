"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */

// describe("POST /jobs", function () {
//   const newJob = {
//     title: "new",
//     salary: 9000,
//     companyHandle: "c1",
//   };

//   test("works: for admin", async function () {

//     const resp = await request(app)
//         .post("/jobs")
//         .send(newJob)
//         .set("authorization", `Bearer ${u1Token}`);
//         console.log(resp.locals)
//     expect(resp.statusCode).toEqual(201);
//     let jobs = await db.query(`SELECT id FROM jobs`);
//     expect(jobs.rows.length).toEqual(3)
//   });

//   test("error: for user", async function () {
//     try {
//     const resp = await request(app)
//         .post("/jobs")
//         .send(newJob)
//         .set("authorization", `Bearer ${u2Token}`);
//         console.log(resp.locals)
//     } catch (error) {
//     expect(error.status).toBe(401);
//     expect(error.message).toBe("Unauthorized")
//     }
//   });
  

//   test("error: bad request with missing data", async function () {
//     const resp = await request(app)
//         .post("/jobs")
//         .send({
//             title: "new",
//             salary: 9000,
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("error: request with invalid data", async function () {
//     const resp = await request(app)
//         .post("/companies")
//         .send({
//           title: "new",
//           salary: 9000,
//           equity: 5,
//           companyHandle: 'c1'
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

/************************************** GET /jobs */
// * Test Driven Development

describe("GET /jobs", function () {

  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    console.log("resp:", resp)
    expect(resp.body).toEqual({
        jobs:
          [ {
            id: expect.any(Number),
            title: "J1T",
            salary: 1000,
            equity: "0.1",
            companyHandle: "c1",
            },
            {
            id: expect.any(Number),
            title: "J2T",
            salary: 5000,
            equity: "0.2",
            companyHandle: "c2",
            }
            
          ],
    });
  });

//   test("works: with title", async function () {
//     const resp = await request(app).get("/companies?title='J'");
//     expect(resp.body).toEqual({
//       companies:
//           [
//             {
//             id: "1",
//             title: "J1",
//             salary: "1000",
//             equity: "0.1",
//             companyHandle: "c1",
//             },
//             {
//             id: "2",
//             title: "J2",
//             salary: "5000",
//             equity: "0.2",
//             companyHandle: "c2",
//             },
//           ],
//     });
//   });

//   test("works: with title, equity and salary", async function () {
//     const resp = await request(app).get("/jobs?title=j&equity=true&salary=1000");
//     expect(resp.body).toEqual({
//       companies:
//           [
//             {
//                 id: "1",
//                 title: "J1",
//                 salary: "1000",
//                 equity: "0.1",
//                 companyHandle: "c1",
//             }
//           ],
//     });
//   });

//   test("works: with salary as string", async function () {
//     const resp = await request(app).get("/jobs?salary=string");
//     expect(resp.body).toEqual({
//       companies:
//           [
//             {
//                 id: "1",
//                 title: "J1",
//                 salary: "1000",
//                 equity: "0.1",
//                 companyHandle: "c1",
//                 },
//                 {
//                 id: "2",
//                 title: "J2",
//                 salary: "5000",
//                 equity: "0.2",
//                 companyHandle: "c2",
//             }
//           ],
//     });
//   });

  test("Error: equity as string", async function () {
    try{ const resp = await request(app).get("/jobs?equity=string");
    } catch (error) {
    expect(error.name).toBe("Error");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Equity must be a boolean!");
  }
  });

  test("Error: salary as negative number", async function () {
    try{ const resp = await request(app).get("/jobs?salary=-3000");
    } catch (error) {
    expect(error.name).toBe("Error");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Salary must be a positive number!");
  }
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /jobs/:id */

// describe("GET /jobs/:id", function () {
//   test("works for anon", async function () {
//     const resp = await request(app).get(`/jobs/1`);
//     expect(resp.body).toEqual({
//         {
//             id: "1",
//             title: "J1",
//             salary: "1000",
//             equity: "0.1",
//             companyHandle: "c1",
//             },
//     });
//   });

//   test("error: not found for job with id", async function () {
//     const resp = await request(app).get(`/job/0`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

/************************************** PATCH /companies/:handle */

// describe("PATCH /jobs/:id", function () {
//   test("works: for admin", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/1`)
//         .send({
//           title: "Updated Job",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({
//         {
//             id: "1",
//             title: "Updated Job",
//             salary: "1000",
//             equity: "0.1",
//             companyHandle: "c1",
//         },
//     });
//   });

//   test("error: for user", async function () {
//     try {
//       const resp = await request(app)
//       .patch(`/jobs/1`)
//       .send({
//         title: "Updated Job",
//       })
//       .set("authorization", `Bearer ${u2Token}`);
//     } catch (error) {
//     expect(error.status).toBe(401);
//     expect(error.message).toBe("Unauthorized")
//     }
//   });


//   test("error: unauth for anon", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/1`)
//         .send({
//           title: "Updated Job",
//         });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("error: job id not found", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/0`)
//         .send({
//           title: "Updated Job",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("error: bad request on companyHandle change attempt", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/1`)
//         .send({
//           companyHandle: "c2",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("error: bad request on invalid data", async function () {
//     const resp = await request(app)
//         .patch(`/jobs/1`)
//         .send({
//           logoUrl: "not-a-url",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

/************************************** DELETE /companies/:handle */

// describe("DELETE /companies/:handle", function () {
//   test("works: for admin", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({ deleted: "c1" });
//   });

//     test("error: for user", async function () {
//     try {
//       const resp = await request(app)
//       .delete(`/companies/c1`)
//       .set("authorization", `Bearer ${u2Token}`);
//     } catch (error) {
//     expect(error.status).toBe(401);
//     expect(error.message).toBe("Unauthorized")
//     }
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app)
//         .delete(`/companies/nope`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
