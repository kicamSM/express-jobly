const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// This function is updating javascript to SQl when updating either users or companies 


  /** sqlForPartialUpdate accepts dataToUpdate and jsToSql
   * 
   * dataToUpdate is actual json being passed 
   *      example: update user  { firstName: 'Test', lastName: 'ELEPHANT', email: fadhfj@gmail.com }
   * 
   * jsToSql is object with keys. Keys are formatted json values are sql column names. 
   *      example: { firstName: first_name }
   * 
   * Sets sql col names = index in array
   * 
   * Returns object { setCols: '"sqlColName1", "sqlColName2"', values: ['value1', 'value2'] }
   *      example { setCols: ' "first_name=$1", "last_name=$2"', values: [ 'Fred', 'Harrison' ]  }
   * 
   * */






function sqlForPartialUpdate(dataToUpdate, jsToSql) {

  const keys = Object.keys(dataToUpdate);
  
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
