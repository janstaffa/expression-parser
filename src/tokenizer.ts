type TokenType =
  | 'Literal'
  | 'Operator'
  | 'Function'
  | 'LParen'
  | 'RParen'
  | 'Var';

class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
}

const isLiteral = (str: string) => /\d|\./.test(str);
const isChar = (str: string) => /[a-z]/i.test(str);
const Tokenizer = {
  tokenize: (expression: string): Token[] => {
    const trimmedExpression = expression.replace(/\s+/g, '');
    const output: Token[] = [];
    let charBuffer = '';
    let literalBuffer = '';
    let multiplyBuffer: Token[] = [];
    for (const [idx, char] of trimmedExpression.split('').entries()) {
      const isLast = idx === trimmedExpression.length - 1;

      // is char
      if (isChar(char)) {
        if (multiplyBuffer.length > 0) {
          multiplyBuffer.push(new Token('Var', char));
        } else {
          charBuffer += char;
        }
      }
      // is literal
      else if (isLiteral(char)) {
        literalBuffer += char;
      }
      if ((!isChar(char) && !isLiteral(char)) || isLast) {
        if (charBuffer.length > 0) {
          if (literalBuffer.length > 0) {
            multiplyBuffer.push(new Token('Literal', literalBuffer));
            literalBuffer = '';
          }
          if (/^(sin|cos|tan)$/.test(charBuffer)) {
            if (multiplyBuffer.length > 0) {
              multiplyBuffer.push(new Token('Function', charBuffer));
            } else {
              output.push(new Token('Function', charBuffer));
            }
          } else {
            if (charBuffer.length > 1 || char === '(') {
              for (const v of charBuffer) {
                multiplyBuffer.push(new Token('Var', v));
              }
            } else if (multiplyBuffer.length > 0) {
              multiplyBuffer.push(new Token('Var', charBuffer));
            } else {
              output.push(new Token('Var', charBuffer));
            }
          }
          charBuffer = '';
        }
        if (literalBuffer.length > 0) {
          if (char === '(') {
            multiplyBuffer.push(new Token('Literal', literalBuffer));
          } else {
            output.push(new Token('Literal', literalBuffer));
          }

          literalBuffer = '';
        }
        if (multiplyBuffer.length > 0) {
          for (const [i, token] of multiplyBuffer.entries()) {
            output.push(token);
            if (
              i < multiplyBuffer.length - 1 ||
              (token.type !== 'Function' && char === '(')
            ) {
              output.push(new Token('Operator', '*'));
            }
          }
          multiplyBuffer = [];
        }

        // is operator
        if (/\+|-|\*|\/|\^/.test(char)) {
          const prevToken = output[output.length - 1];
          if (char === '-' && (!prevToken || prevToken.value === '(')) {
            literalBuffer += char;
          } else {
            output.push(new Token('Operator', char));
          }
        }
        // is left parenthesis
        else if (char === '(') {
          if (output[output.length - 1]?.value === ')') {
            output.push(new Token('Operator', '*'));
          }
          output.push(new Token('LParen', char));
        }
        // is right parenthesis
        else if (char === ')') {
          output.push(new Token('RParen', char));
        }
      }
    }

    // error check
    for (const token of output) {
      if (token.type === 'Var') {
        if (token.value.length !== 1) {
          throw new Error('Variables can only be 1 character long.');
        }
      }
    }
    return output;
  },

  tokenizeToString: (expression: string) => {
    const arr = Tokenizer.tokenize(expression);
    return arr.map((t) => t.value).join('');
  },
};

export default Tokenizer;