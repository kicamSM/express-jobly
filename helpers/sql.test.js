// const jwt = require("jsonwebtoken");
// const { createToken, sqlForPartialUpdate } = require("./sql");
// const { SECRET_KEY } = require("../config");
const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");


describe("sqlForPartialUpdate", function () {
    test("works", function () {

    const dataToUpdate = {first_name: 'Aliya', age: 32}
    //   expect(col).toEqual(['"first_name"=$1', '"age"=$2']);
    const jsToSql = {first_name: "firstName"}
    let sql = sqlForPartialUpdate(dataToUpdate, jsToSql)
    expect(sql).toEqual({
        setCols: "\"firstName\"=$1, \"age\"=$2",
        values: ["Aliya", 32] });
});

test("Returns error for empty object", function () {
    const dataToUpdate = {}
    try {
        let sql = sqlForPartialUpdate(dataToUpdate)
    } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError)
        expect(err.message).toEqual("No data")
    }
    });
})

