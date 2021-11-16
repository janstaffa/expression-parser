import { Tokenizer } from ".";

class Parser {
  private ASSOC: { [key: string]: "left" | "right" } = {
    "^": "right",
    "*": "left",
    "/": "left",
    "+": "left",
    "-": "left",
  };
  private PREC: { [key: string]: number } = {
    "^": 4,
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2,
  };

  /**
   * @param expression The mathematical expression to be calculated.
   * @param unknowns An object of key-value pairs of unknowns with their values.
   */

  //actually calculate the expression with unknowns passed as args
  evaluate = (expression: string, unknowns: { [key: string]: string }) => {
    return 0;
  };

  parse = (expression: string, format: ("rpn" | "ast") | undefined = "rpn") => {
    const tokens = Tokenizer.tokenize(expression);

    // RPN
    const outQueue = [];
    const opStack = [];

    for (const t of tokens) {
      const { type, value } = t;
      if (/^(Literal|Var)$/.test(type)) {
        outQueue.push(t);
      } else if (type === "Function") {
        opStack.push(t);
      } else if (type === "ArgumentSeparator") {
        while (opStack[opStack.length - 1]?.type !== "LParen") {
          outQueue.push(opStack.pop());
        }
      } else if (type === "Operator") {
        while (
          opStack[opStack.length - 1] &&
          opStack[opStack.length - 1].type === "Operator"
        ) {
          const o = opStack[opStack.length - 1];
          const tAssoc = this.ASSOC[value];
          const tPrec = this.PREC[value];
          const oPrec = this.PREC[o.value];
          if (tPrec < oPrec || (tAssoc === "left" && tPrec === oPrec)) {
            outQueue.push(opStack.pop());
          } else {
            break;
          }
        }
        opStack.push(t);
      } else if (type === "LParen") {
        opStack.push(t);
      } else if (type === "RParen") {
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
      }
    }
    while (opStack.length > 0) {
      const op = opStack.pop();
      if (!op || /^(LParen|RParen)$/.test(op.type)) {
        throw new Error("Invalid syntax.");
      }
      outQueue.push(op);
    }

    let output = "";
    if (format === "rpn") {
      output = outQueue.map((o) => o?.value).join("");
    }
    return output;
  };
}

export default Parser;
