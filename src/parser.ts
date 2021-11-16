import { Tokenizer } from '.';
import { Token } from './tokenizer';

class Parser {
  private OPS: {
    [key: string]: { assoc: 'left' | 'right'; prec: number; args: number };
  } = {
    '^': { assoc: 'right', prec: 4, args: 2 },
    '*': { assoc: 'left', prec: 3, args: 2 },
    '/': { assoc: 'left', prec: 3, args: 2 },
    '+': { assoc: 'left', prec: 2, args: 2 },
    '-': { assoc: 'left', prec: 2, args: 2 },
  };
  /**
   * @param expression The mathematical expression to be calculated.
   * @param unknowns An object of key-value pairs of unknowns with their values.
   */

  //actually calculate the expression with unknowns passed as args
  evaluate = (expression: string, unknowns?: { [key: string]: number }) => {
    // replace unknowns with literal values

    const parsed = this.parse(expression);

    const usesUnknowns = parsed.find((t) => t?.type === 'Var');
    if (usesUnknowns && !unknowns) {
      throw new Error(
        `Cannot evaluate expression: '${expression}' without knowing all unknown variables.`
      );
    }
    while (parsed.length > 1) {
      for (const [idx, token] of parsed.entries()) {
        if (!token) continue;

        if (token.type === 'Var') {
          parsed[idx] = new Token('Literal', unknowns![token.value].toString());
        } else if (token.type === 'Operator') {
          let result;
          const arg2 = parsed[idx - 1];
          const arg1 = parsed[idx - 2];

          if (
            !arg1 ||
            !arg2 ||
            arg1.type !== 'Literal' ||
            arg2.type !== 'Literal'
          )
            return;
          switch (token.value) {
            case '+':
              result = parseInt(arg1.value) + parseInt(arg2.value);
              break;
            case '-':
              result = parseInt(arg1.value) - parseInt(arg2.value);
              break;
            case '*':
              result = parseInt(arg1.value) * parseInt(arg2.value);
              break;
            case '/':
              result = parseInt(arg1.value) / parseInt(arg2.value);
              break;
            case '^':
              result = Math.pow(parseInt(arg1.value), parseInt(arg2.value));
              break;
          }

          if (result === undefined) return;
          // replace parameters and operator with result
          parsed.splice(idx - 2, 3, new Token('Literal', result.toString()));
          break;
        }
      }
    }
    return parsed[0]?.value;
  };

  parse = (expression: string) => {
    const tokens = Tokenizer.tokenize(expression);

    // RPN
    const outQueue = [];
    const opStack = [];

    for (const t of tokens) {
      const { type, value } = t;
      if (/^(Literal|Var)$/.test(type)) {
        outQueue.push(t);
      } else if (type === 'Function') {
        opStack.push(t);
      } else if (type === 'ArgumentSeparator') {
        while (opStack[opStack.length - 1]?.type !== 'LParen') {
          outQueue.push(opStack.pop());
        }
      } else if (type === 'Operator') {
        while (
          opStack[opStack.length - 1] &&
          opStack[opStack.length - 1].type === 'Operator'
        ) {
          const o = opStack[opStack.length - 1];
          const tAssoc = this.OPS[value].assoc;
          const tPrec = this.OPS[value].prec;
          const oPrec = this.OPS[o.value].prec;
          if (tPrec < oPrec || (tAssoc === 'left' && tPrec === oPrec)) {
            outQueue.push(opStack.pop());
          } else {
            break;
          }
        }
        opStack.push(t);
      } else if (type === 'LParen') {
        opStack.push(t);
      } else if (type === 'RParen') {
        while (
          opStack[opStack.length - 1] &&
          opStack[opStack.length - 1].type !== 'LParen'
        ) {
          outQueue.push(opStack.pop());
        }
        opStack.pop();
        const lastOp = opStack[opStack.length - 1];
        if (lastOp && lastOp.type === 'Function') {
          outQueue.push(opStack.pop());
        }
      }
    }
    while (opStack.length > 0) {
      const op = opStack.pop();
      if (!op || /^(LParen|RParen)$/.test(op.type)) {
        throw new Error('Invalid syntax.');
      }
      outQueue.push(op);
    }

    return outQueue;
  };
  parseToString = (expression: string) => {
    const out = this.parse(expression);
    if (!out) return null;
    const output = out.map((o) => o?.value).join('');
    return output;
  };
}

export default Parser;
