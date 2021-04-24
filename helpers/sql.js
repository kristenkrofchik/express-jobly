const { BadRequestError } = require("../expressError");

//function for making partial update SQL queries

//dataToUpdate --- {key1: newVal, key2: newVal2}

//jsToSql --- this maps a js key with its SQL column name --- {firstName: 'first_name, lastName: 'last_name}

//example --- {firstName: 'Aliya', age: 32} =>{ setCols: '"first_name"=$1, "age"=$2', values: ['Aliya', 32] }

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
