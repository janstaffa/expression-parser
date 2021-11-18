import ParserClass from './parser';
import TokenizerClass from './tokenizer';
const Tokenizer = new TokenizerClass();
const Parser = new ParserClass();
export { Parser, Tokenizer };

// TODO:
// make the entire codebase less trash
// add factorial

console.log(Tokenizer.tokenize('(x-100000)!'));
