import ParserClass from './parser';
import TokenizerClass from './tokenizer';
const Tokenizer = new TokenizerClass();
const Parser = new ParserClass();
export { Parser, Tokenizer };

// const exp = '2-(x+2(x-5))';
// console.log(exp, Tokenizer.tokenize(exp));

// console.log(Parser.evaluate('cos(x)', { x: 10 }));

// TODO:
// check for function argument length in tokenizer
// convert sqrt(x) to root(x, 2) in tokenizer
