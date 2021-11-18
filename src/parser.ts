import { Tokenizer } from ".";
import { Token } from "./tokenizer";

class Parser {
  private OPS: {
    [key: string]: { assoc: "left" | "right"; prec: number };
  } = {
    "^": { assoc: "right", prec: 4 },
    "*": { assoc: "left", prec: 3 },
    "/": { assoc: "left", prec: 3 },
    "+": { assoc: "left", prec: 2 },
    "-": { assoc: "left", prec: 2 },
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
  };
  /**
   * @param expression The mathematical expression to be calculated.
   * @param unknowns An object of key-value pairs of unknowns with their values.
   */

  //actually calculate the expression with unknowns passed as args
  evaluate = (
    expression: string,
    unknowns?: { [key: string]: number },
    flags: { useRadians: boolean } | undefined = { useRadians: false }
  ) => {
    const parsed = this.parse(expression);

    do {
      for (const [idx, token] of parsed.entries()) {
        if (!token) continue;

        if (token.type === "Var") {
          const unknownValue = unknowns?.[token.value];
          if (!unknownValue) {
            throw new Error(
              `Literal value for unknown '${token.value}' was not provided.`
            );
          }

          parsed[idx] = new Token("Literal", unknownValue.toString());
          continue;
        } else if (token.type === "Operator") {
          let result;
          const arg1 = parsed[idx - 2];
          const arg2 = parsed[idx - 1];

          if (
            !arg1 ||
            !arg2 ||
            arg1.type !== "Literal" ||
            arg2.type !== "Literal"
          ) {
            throw new Error(`Error evaluating expression '${expression}'.`);
          }

          switch (token.value) {
            case "+":
              result = parseFloat(arg1.value) + parseFloat(arg2.value);
              break;
            case "-":
              result = parseFloat(arg1.value) - parseFloat(arg2.value);
              break;
            case "*":
              result = parseFloat(arg1.value) * parseFloat(arg2.value);
              break;
            case "/":
              result = parseFloat(arg1.value) / parseFloat(arg2.value);
              break;
            case "^":
              result = Math.pow(parseFloat(arg1.value), parseFloat(arg2.value));
              break;
          }

          if (result === undefined)
            throw new Error(`Error evaluating expression '${expression}'.`);
          // replace parameters and operator with result
          parsed.splice(idx - 2, 3, new Token("Literal", result.toString()));
          break;
        } else if (token.type === "Function") {
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
            case "sin":
            case "cos":
            case "tan":
              {
                const arg = args[0]?.value;
                if (!arg) break;
                const realValue = flags.useRadians
                  ? parseFloat(arg)
                  : parseFloat(arg) * (Math.PI / 180);
                switch (token.value) {
                  case "sin":
                    result = Math.sin(realValue);
                    break;
                  case "cos":
                    result = Math.cos(realValue);
                    break;
                  case "tan":
                    result = Math.tan(realValue);
                    break;
                }
              }
              break;
            case "sqrt":
              {
                const arg = args[0]?.value;
                if (!arg) break;
                result = Math.sqrt(parseFloat(arg));
              }
              break;
            case "root":
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = Math.pow(parseFloat(arg1), 1 / parseFloat(arg2));
              }
              break;

            case "abs":
              {
                const arg = args[0]?.value;
                if (!arg) break;
                result = Math.abs(parseFloat(arg));
              }
              break;
            case "max":
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = Math.max(parseFloat(arg1), parseFloat(arg2));
              }
              break;
            case "min":
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = Math.min(parseFloat(arg1), parseFloat(arg2));
              }
              break;
            case "mod":
              {
                const arg1 = args[0]?.value;
                const arg2 = args[1]?.value;
                if (!arg1 || !arg2) break;
                result = parseFloat(arg1) % parseFloat(arg2);
              }
              break;
          }
          if (result === undefined)
            throw new Error(`Error evaluating expression '${expression}'.`);
          // replace parameters and operator with result
          parsed.splice(
            idx - argCount,
            argCount + 1,
            new Token("Literal", result.toString())
          );
          break;
        }
      }
    } while (parsed.length > 1);
    return parsed[0]?.value;
  };

  parse = (expression: string) => {
    const tokens = Tokenizer.tokenize(expression);

    // RPN
    const outQueue = [];
    const opStack = [];

    let absPipeCount = 0;
    for (const t of tokens) {
      const { type, value } = t;

      switch (type) {
        case "Literal":
        case "Var":
          outQueue.push(t);
          break;
        case "Function":
        case "LParen":
          opStack.push(t);
          break;
        case "ArgumentSeparator":
          while (opStack[opStack.length - 1]?.type !== "LParen") {
            outQueue.push(opStack.pop());
          }
          break;
        case "Operator":
          while (
            opStack[opStack.length - 1] &&
            opStack[opStack.length - 1].type === "Operator"
          ) {
            const o = opStack[opStack.length - 1];
            const tAssoc = this.OPS[value].assoc;
            const tPrec = this.OPS[value].prec;
            const oPrec = this.OPS[o.value].prec;
            if (tPrec < oPrec || (tAssoc === "left" && tPrec === oPrec)) {
              outQueue.push(opStack.pop());
            } else {
              break;
            }
          }
          opStack.push(t);
          break;
        case "RParen":
          while (
            opStack[opStack.length - 1] &&
            opStack[opStack.length - 1].type !== "LParen"
          ) {
            outQueue.push(opStack.pop());
          }
          opStack.pop();
          const lastOp = opStack[opStack.length - 1];
          if (lastOp && lastOp.type === "Function") {
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
        throw new Error("Invalid syntax.");
      }
      outQueue.push(op);
    }

    return outQueue;
  };
  parseToString = (expression: string) => {
    const out = this.parse(expression);
    if (!out) return null;
    const output = out.map((o) => o?.value).join("");
    return output;
  };
}

export default Parser;
