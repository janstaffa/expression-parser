type TokenType =
  | 'Literal'
  | 'Operator'
  | 'Function'
  | 'ArgumentSeparator'
  | 'LParen'
  | 'RParen'
  | 'Var';

export class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
}

export const isLiteral = (str: string) => /\d|\./.test(str);
export const isChar = (str: string) => /[a-z]/i.test(str);
export const isOperator = (str: string) => /\+|\-|\*|\/|\^/.test(str);
export const isFunction = (str: string) =>
  /^(sin|cos|tan|min|max|mod|sqrt|root|abs|fac)$/.test(str);
const leftBracketRegex = /\(|\[|\{/;
const rightBracketRegex = /\)|\]|\}/;
class Tokenizer {
  tokenize = (expression: string): Token[] => {
    const trimmedExpression = expression.replace(/\s+/g, '');
    const output: Token[] = [];
    let charBuffer = '';
    let literalBuffer = '';
    let multiplyBuffer: Token[] = [];

    const tokens = trimmedExpression.split('');
    for (const [idx, char] of tokens.entries()) {
      const isLast = idx === trimmedExpression.length - 1;

      // is char
      if (isChar(char)) {
        if (multiplyBuffer.length > 0) {
          multiplyBuffer.push(new Token('Var', char));
        } else {
          charBuffer += char;
        }

        if (!isLast) continue;
      }
      // is literal
      else if (isLiteral(char)) {
        if (multiplyBuffer.length > 0) {
          multiplyBuffer.push(new Token('Literal', char));
        } else {
          literalBuffer += char;
        }
        if (!isLast) continue;
      }

      if (charBuffer.length > 0) {
        // if there is a number in the literal buffer use it as multiplier
        if (literalBuffer.length > 0) {
          multiplyBuffer.push(new Token('Literal', literalBuffer));
          literalBuffer = '';
        }
        // is the char buffer a function
        if (isFunction(charBuffer)) {
          if (multiplyBuffer.length > 0) {
            multiplyBuffer.push(new Token('Function', charBuffer));
          } else {
            output.push(new Token('Function', charBuffer));
          }
        } else {
          if (charBuffer.length > 1 || leftBracketRegex.test(char)) {
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
        // if the literal is before LParen ex:'2(x)', use it as multiplier
        if (leftBracketRegex.test(char)) {
          multiplyBuffer.push(new Token('Literal', literalBuffer));
        } else {
          output.push(new Token('Literal', literalBuffer));
        }

        literalBuffer = '';
      }

      // multiply all items in multiplyBuffer
      if (multiplyBuffer.length > 0) {
        for (const [i, token] of multiplyBuffer.entries()) {
          output.push(token);
          if (
            i < multiplyBuffer.length - 1 ||
            (token.type !== 'Function' && leftBracketRegex.test(char))
          ) {
            output.push(new Token('Operator', '*'));
          }
        }
        multiplyBuffer = [];
      }

      // is operator
      if (isOperator(char)) {
        const prevToken = output[output.length - 1];
        if (
          char === '-' &&
          (!prevToken || leftBracketRegex.test(prevToken.value))
        ) {
          multiplyBuffer.push(new Token('Literal', '-1'));
        } else {
          output.push(new Token('Operator', char));
        }
      }
      // is left parenthesis
      else if (leftBracketRegex.test(char)) {
        if (rightBracketRegex.test(output[output.length - 1]?.value)) {
          output.push(new Token('Operator', '*'));
        }
        output.push(new Token('LParen', char));
      }
      // is right parenthesis
      else if (rightBracketRegex.test(char)) {
        output.push(new Token('RParen', char));
      }
      // is function argument separator
      else if (char === ',') {
        output.push(new Token('ArgumentSeparator', char));
      } else if (char === '!') {
        const lastChar = output[output.length - 1]?.value;
        if (!lastChar) continue;
        const originalLength = output.length;
        let i = 1;
        if (rightBracketRegex.test(lastChar)) {
          while (!leftBracketRegex.test(output[output.length - i]?.value)) {
            if (i > 500) throw new Error('Too many iterations.');
            i++;
          }
        } else {
          output.splice(originalLength - i, 0, new Token('LParen', '('));
          output.push(new Token('RParen', ')'));
        }
        output.splice(originalLength - i, 0, new Token('Function', 'fac'));
      } else {
        if (!isLiteral(char) && !isChar(char)) {
          throw new Error(`Unknown token '${char}'`);
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
  };

  tokenizeToString = (expression: string) => {
    const arr = this.tokenize(expression);
    return arr.map((t) => t.value).join('');
  };
}

export default Tokenizer;
