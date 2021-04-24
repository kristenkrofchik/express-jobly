//require file you are testing
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", function() {
    test('works for one item', function() {
        const result = sqlForPartialUpdate(
            { firstName: "Lisa" },
            { firstName: "first_name"});
        expect(result).toEqual({
            setCols: "\"firstName\"=$1",
            values: ["Lisa"],
            });
    })
    
    test('works for two item', function() {
        const result = sqlForPartialUpdate(
            { firstName: "Lisa", lastName: "Marcos" },
            { firstName: "first_name", lastName: "last_name"});
        expect(result).toEqual({
            setCols: "\"firstName\"=$1, \"lastName\"=$2",
            values: ["Lisa", "Marcos"],
            });
    })
})