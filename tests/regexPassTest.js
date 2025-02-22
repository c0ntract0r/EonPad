const constants = require("../utils/constants")

const regex = constants.RE_PASSWORD;

// SUCCESS
console.log(`1: ${regex.test('pa')}`);  // false
console.log(`2: ${regex.test('password')}`); // false
console.log(`3: ${regex.test('1!Passwo')}`); // true
console.log(`4: ${regex.test('1^Passwo')}`); // true
console.log(`5: ${regex.test('DWjpEK2G3VQelBy')}`); // false
console.log(`6: ${regex.test('zwVGd@Ulw9Lf=8r')}`); // true
console.log(`7: ${regex.test('OY{lhK]lTM@n}l')}`); // false
console.log(`8: ${regex.test('OOOOOOO%1o')}`); // true
console.log(`9: ${regex.test('%*^Passwor1')}`); // true
console.log(`10: ${regex.test("dRRZ{'C_q=EYSx-eu(FEZ4#O")}`); // true

// FAILURE
console.log(`11: ${regex.test("dRRZ{'C_q=EYSx-eu(FEZ4#O1")}`); // false
console.log(`12: ${regex.test("D6fzDy8(N&9R729GlW[9rF$4M}S2")}`); // false