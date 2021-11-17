type TokenType =
  | 'Literal'
  | 'Operator'
  | 'Function'
  | 'ArgumentSeparator'
  | 'LParen'
  | 'RParen'
  | 'Var'
  | 'AbsPipe';

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
  /^(sin|cos|tan|min|max|mod|sqrt|root|abs)$/.test(str);
const leftBracketRegex = /\(|\[|\{/;
const rightBracketRegex = /\)|\]|\}/;
class Tokenizer {
  tokenize = (expression: string): Token[] => {
    const trimmedExpression = expression.replace(/\s+/g, '');
    const output: Token[] = [];
    let charBuffer = '';
    let literalBuffer = '';
    let multiplyBuffer: Token[] = [];

    let absPipeCount = 0;
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
        if (multiplyBuffer.length > 0) {
          multiplyBuffer.push(new Token('Literal', char));
        } else {
          literalBuffer += char;
        }
      }
      if ((!isChar(char) && !isLiteral(char)) || isLast) {
        if (charBuffer.length > 0) {
          if (literalBuffer.length > 0) {
            multiplyBuffer.push(new Token('Literal', literalBuffer));
            literalBuffer = '';
          }
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
        if (char === ',') {
          output.push(new Token('ArgumentSeparator', char));
        }
        if (literalBuffer.length > 0) {
          if (leftBracketRegex.test(char)) {
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
            (!prevToken ||
              leftBracketRegex.test(prevToken.value) ||
              (prevToken.value === '|' && absPipeCount % 2 === 1))
          ) {
            multiplyBuffer.push(new Token('Literal', '-1'));
            // literalBuffer += '-1';
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
        } else if (char === '|') {
          const prevToken = output[output.length - 1];

          // scuffed fix
          if (!prevToken || prevToken.type === 'AbsPipe') {
            absPipeCount = 0;
          }
          absPipeCount++;
          output.push(new Token('AbsPipe', char));
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
