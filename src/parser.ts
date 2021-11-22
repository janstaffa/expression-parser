import Tokenizer, { Token } from './tokenizer';
const g = 7;
const C = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

// https://en.wikipedia.org/wiki/Lanczos_approximation
const gamma = (z: number): number => {
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  else {
    z--;

    let x = C[0];
    for (let i = 1; i < g + 2; i++) x += C[i] / (z + i);

    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
};

class Parser {
  private OPS: {
    [key: string]: { assoc: 'left' | 'right'; prec: number };
  } = {
    '^': { assoc: 'right', prec: 4 },
    '*': { assoc: 'left', prec: 3 },
    '/': { assoc: 'left', prec: 3 },
    '+': { assoc: 'left', prec: 2 },
    '-': { assoc: 'left', prec: 2 },
  };
  private FUNC_ARGS: { [key: string]: number } = {
    sin: 1,
    cos: 1,
    tan: 1,
    sqrt: 1,
    root: 2,
    abs: 1,
    max: 2,
    min: 2,
    mod: 2,
    fac: 1,
    round: 1,
    int: 1,
  };
  /**
   * @param expression The mathematical expression to be calculated.
   * @param unknowns An object of key-value pairs of unknowns with their values.
   */

  //actually calculate the expression with unknowns passed as args
  evaluate = (
    expression: string,
    unknowns?: { [key: string]: number },
    options?: { useRadians?: boolean; decimals?: number }
  ) => {
    // set default values
    options = {
      useRadians: options?.useRadians || false,
      decimals: options?.decimals || 4,
    };
    const parsed = this.parse(expression);

    let i = 0;
    do {
      for (const [idx, token] of parsed.entries()) {
        if (!token) continue;

        if (token.type === 'Var') {
          const unknownValue = unknowns?.[token.value];
          if (typeof unknownValue !== 'number') {
            throw new Error(
              `Literal value for unknown '${token.value}' was not provided.`
            );
          }

          parsed[idx] = new Token('Literal', unknownValue.toString());
          continue;
        } else if (token.type === 'Operator') {
          let result;
          const arg1 = parsed[idx - 2];
          const arg2 = parsed[idx - 1];

          if (
            !arg1 ||
            !arg2 ||
            arg1.type !== 'Literal' ||
            arg2.type !== 'Literal'
          ) {
            throw new Error(`Error evaluating expression '${expression}'.`);
          }

          switch (token.value) {
            case '+':
              result = parseFloat(arg1.value) + parseFloat(arg2.value);
              break;
            case '-':
              result = parseFloat(arg1.value) - parseFloat(arg2.value);
              break;
            case '*':
              result = parseFloat(arg1.value) * parseFloat(arg2.value);
              break;
            case '/':
              result = parseFloat(arg1.value) / parseFloat(arg2.value);
              break;
            case '^':
              result = Math.pow(parseFloat(arg1.value), parseFloat(arg2.value));
              break;
          }

          if (result === undefined)
            throw new Error(`Error evaluating expression '${expression}'.`);
          // replace parameters and operator with result
          parsed.splice(idx - 2, 3, new Token('Literal', result.toString()));
          break;
        } else if (token.type === 'Function') {
          const argCount = this.FUNC_ARGS[token.value];
          if (!argCount) throw new Error(`Unknown function '${token.value}''.`);
          const args = parsed.slice(idx - argCount, idx);
          if (!args || args.length === 0) {
            throw new Error(
              `Function '${token.value}' requires ${argCount} arguments.`
            );
          }
          let result;

          switch (token.value) {
            case 'sin':
            case 'cos':
            case 'tan':
              {
                const arg = args[0]?.value;
                if (!arg) break;
                const realValue = options.useRadians
                  ? parseFloat(arg)
                  : parseFloat(arg) * (Math.PI / 180);
                switch (token.value) {
                  case 'sin':
                    result = Math.sin(realValue);
                    break;
                  case 'cos':
                    result = Math.cos(realValue);
                    break;
                  case 'tan':
                    result = Math.tan(realValue);
                    break;
                }
              }
              break;
            case 'sqrt':
              {
                const arg = args[0]?.value;
                if (!arg) break;
                result = Math.sqrt(parseFloat(arg));
              }
              break;
            case 'root':
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = Math.pow(parseFloat(arg1), 1 / parseFloat(arg2));
              }
              break;

            case 'abs':
              {
                const arg = args[0]?.value;
                if (!arg) break;
                result = Math.abs(parseFloat(arg));
              }
              break;
            case 'max':
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = Math.max(parseFloat(arg1), parseFloat(arg2));
              }
              break;
            case 'min':
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = Math.min(parseFloat(arg1), parseFloat(arg2));
              }
              break;
            case 'mod':
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = parseFloat(arg1) % parseFloat(arg2);
              }
              break;
            case 'fac':
              {
                const arg = args[0]?.value;
                if (!arg) break;
                let parsed = parseFloat(arg);
                if (parsed < 0) {
                  result = NaN;
                  break;
                }
                result = parsed * gamma(parsed);
              }
              break;
            case 'round':
              {
                const arg = args[0]?.value;
                if (!arg) break;
                let parsed = parseFloat(arg);
                result = Math.round(parsed);
              }
              break;

            case 'int': {
              const arg = args[0]?.value;
              if (!arg) break;
              let parsed = parseInt(arg);
              result = Math.trunc(parsed);
            }
          }
          if (result === undefined)
            throw new Error(`Error evaluating expression '${expression}'.`);
          // replace parameters and operator with result
          parsed.splice(
            idx - argCount,
            argCount + 1,
            new Token('Literal', result.toString())
          );
          break;
        }
      }
      if (i > 500) throw new Error('Too many iterations.');
      i++;
    } while (parsed.length > 1);
    if (parsed.length > 1 || parsed.length === 0 || !parsed[0]) {
      throw new Error('Invalid syntax.');
    }
    const parsedResult = parseFloat(parsed[0].value);
    let finalResult = parsedResult;
    if (parsedResult % 1 !== 0) {
      finalResult = parseFloat(finalResult.toFixed(options.decimals));
    }
    return finalResult;
  };

  parse = (expression: string) => {
    const tokens = Tokenizer.tokenize(expression);

    // RPN
    const outQueue = [];
    const opStack = [];

    for (const t of tokens) {
      const { type, value } = t;

      switch (type) {
        case 'Literal':
        case 'Var':
          outQueue.push(t);
          break;
        case 'Function':
        case 'LParen':
          opStack.push(t);
          break;
        case 'ArgumentSeparator':
          while (opStack[opStack.length - 1]?.type !== 'LParen') {
            if (opStack.length === 0) break;
            outQueue.push(opStack.pop());
          }
          break;
        case 'Operator':
          while (
            opStack[opStack.length - 1] &&
            opStack[opStack.length - 1].type === 'Operator'
          ) {
            if (opStack.length === 0) break;
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
          break;
        case 'RParen':
          while (
            opStack[opStack.length - 1] &&
            opStack[opStack.length - 1].type !== 'LParen'
          ) {
            if (opStack.length === 0) break;
            outQueue.push(opStack.pop());
          }
          opStack.pop();
          const lastOp = opStack[opStack.length - 1];
          if (lastOp && lastOp.type === 'Function') {
            outQueue.push(opStack.pop());
          }
          break;
        default:
          throw new Error(`Unknown token '${t.value}'.`);
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

export default new Parser();
