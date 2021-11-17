import ParserClass from './parser';
import TokenizerClass from './tokenizer';
const Tokenizer = new TokenizerClass();
const Parser = new ParserClass();
export { Parser, Tokenizer };

// TODO:
// check for function argument length in tokenizer
// convert sqrt(x) to root(x, 2) in tokenizer
// convert |x| to abs(x) in tokenizer -> more complex (nested) abs values don't work!

// |x-2| === abs(x-2)
// |2|x-2| - 1|
// |(2|x-2| - 1)|

console.log(Parser.parse('|x|'));
