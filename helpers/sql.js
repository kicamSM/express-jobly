const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// This function is updating javascript to SQl when updating either users or companies 
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
// this function is getting passed on object which is our data. The jsToSql is a map from javascript property names. If this is not provided, the Javascript property names in the dataToUpdate will be used as the Coumns. This allows different handlings of names between data and column names. 
  const keys = Object.keys(dataToUpdate);
  // this variable grabs each of the keys from the object dataToUpdate and makes an array from all keys.

  if (keys.length === 0) throw new BadRequestError("No data");
  // This line throws an error if there are no keys which means that the data that was passed is empty. Returns error "No Data"

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  // This function maps the keys and takes in two arguemnts. The colName and the idx of where that colName is in the keys array. If the jsToSql was passed into the sqlForPartialUPdate the jsToSql[coluName] will run if not the colName will run. This ensures we have the correct colName. and we are setting that equal to the $(index + 1) which will represent our parameters bound to our values. i.e. in the example above 

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
  // This then returns an object with two properties. A set columns property.The setCols statement which will be the const colums which we defined above seperated by a comma. The values which will be an array of values from the object dataToUpdate. This will then be passed on to the SQL to update the database.
}

module.exports = { sqlForPartialUpdate };

// function sqlForPartialUpdate(dataToUpdate, jsToSql) { 
//   const keys = Object.keys(dataToUpdate);
//   if (keys.length === 0) throw new BadRequestError("No data");
//   const cols = keys.map((colName, idx) =>
//   `"${jsToSql[colName] || colName}"=$${idx + 1}`,
// );
// return {
//   setCols: cols.join(", "),
//   values: Object.values(dataToUpdate),
// };
// }