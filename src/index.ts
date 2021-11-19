import Parser from './parser';
const evaluate = Parser.evaluate;
const parse = Parser.parseToString;
export default { evaluate, parse };

console.log(evaluate('-max(5,2)'));
