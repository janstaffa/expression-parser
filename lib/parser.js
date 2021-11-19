"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizer_1 = __importStar(require("./tokenizer"));
class Parser {
    constructor() {
        this.OPS = {
            '^': { assoc: 'right', prec: 4 },
            '*': { assoc: 'left', prec: 3 },
            '/': { assoc: 'left', prec: 3 },
            '+': { assoc: 'left', prec: 2 },
            '-': { assoc: 'left', prec: 2 },
        };
        this.FUNC_ARGS = {
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
        };
        this.evaluate = (expression, unknowns, options) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            options = {
                useRadians: (options === null || options === void 0 ? void 0 : options.useRadians) || false,
                decimals: (options === null || options === void 0 ? void 0 : options.decimals) || 4,
            };
            const parsed = this.parse(expression);
            let i = 0;
            do {
                for (const [idx, token] of parsed.entries()) {
                    if (!token)
                        continue;
                    if (token.type === 'Var') {
                        const unknownValue = unknowns === null || unknowns === void 0 ? void 0 : unknowns[token.value];
                        if (!unknownValue) {
                            throw new Error(`Literal value for unknown '${token.value}' was not provided.`);
                        }
                        parsed[idx] = new tokenizer_1.Token('Literal', unknownValue.toString());
                        continue;
                    }
                    else if (token.type === 'Operator') {
                        let result;
                        const arg1 = parsed[idx - 2];
                        const arg2 = parsed[idx - 1];
                        if (!arg1 ||
                            !arg2 ||
                            arg1.type !== 'Literal' ||
                            arg2.type !== 'Literal') {
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
                        parsed.splice(idx - 2, 3, new tokenizer_1.Token('Literal', result.toString()));
                        break;
                    }
                    else if (token.type === 'Function') {
                        const argCount = this.FUNC_ARGS[token.value];
                        if (!argCount)
                            throw new Error(`Unknown function '${token.value}''.`);
                        const args = parsed.slice(idx - argCount, idx);
                        if (!args || args.length === 0) {
                            throw new Error(`Function '${token.value}' requires ${argCount} arguments.`);
                        }
                        let result;
                        switch (token.value) {
                            case 'sin':
                            case 'cos':
                            case 'tan':
                                {
                                    const arg = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.value;
                                    if (!arg)
                                        break;
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
                                    const arg = (_b = args[0]) === null || _b === void 0 ? void 0 : _b.value;
                                    if (!arg)
                                        break;
                                    result = Math.sqrt(parseFloat(arg));
                                }
                                break;
                            case 'root':
                                {
                                    const arg1 = (_c = args[0]) === null || _c === void 0 ? void 0 : _c.value;
                                    const arg2 = (_d = args[1]) === null || _d === void 0 ? void 0 : _d.value;
                                    if (!arg1 || !arg2)
                                        break;
                                    result = Math.pow(parseFloat(arg1), 1 / parseFloat(arg2));
                                }
                                break;
                            case 'abs':
                                {
                                    const arg = (_e = args[0]) === null || _e === void 0 ? void 0 : _e.value;
                                    if (!arg)
                                        break;
                                    result = Math.abs(parseFloat(arg));
                                }
                                break;
                            case 'max':
                                {
                                    const arg1 = (_f = args[0]) === null || _f === void 0 ? void 0 : _f.value;
                                    const arg2 = (_g = args[1]) === null || _g === void 0 ? void 0 : _g.value;
                                    if (!arg1 || !arg2)
                                        break;
                                    result = Math.max(parseFloat(arg1), parseFloat(arg2));
                                }
                                break;
                            case 'min':
                                {
                                    const arg1 = (_h = args[0]) === null || _h === void 0 ? void 0 : _h.value;
                                    const arg2 = (_j = args[1]) === null || _j === void 0 ? void 0 : _j.value;
                                    if (!arg1 || !arg2)
                                        break;
                                    result = Math.min(parseFloat(arg1), parseFloat(arg2));
                                }
                                break;
                            case 'mod':
                                {
                                    const arg1 = (_k = args[0]) === null || _k === void 0 ? void 0 : _k.value;
                                    const arg2 = (_l = args[1]) === null || _l === void 0 ? void 0 : _l.value;
                                    if (!arg1 || !arg2)
                                        break;
                                    result = parseFloat(arg1) % parseFloat(arg2);
                                }
                                break;
                            case 'fac':
                                {
                                    const arg = (_m = args[0]) === null || _m === void 0 ? void 0 : _m.value;
                                    if (!arg)
                                        break;
                                    let count = parseFloat(arg);
                                    if (count < 0) {
                                        result = NaN;
                                        break;
                                    }
                                    let subResult = count;
                                    while (count > 1) {
                                        count--;
                                        subResult *= count;
                                    }
                                    result = subResult;
                                }
                                break;
                        }
                        if (result === undefined)
                            throw new Error(`Error evaluating expression '${expression}'.`);
                        parsed.splice(idx - argCount, argCount + 1, new tokenizer_1.Token('Literal', result.toString()));
                        break;
                    }
                }
                if (i > 500)
                    throw new Error('Too many iterations.');
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
        this.parse = (expression) => {
            var _a;
            const tokens = tokenizer_1.default.tokenize(expression);
            const outQueue = [];
            const opStack = [];
            let absPipeCount = 0;
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
                        while (((_a = opStack[opStack.length - 1]) === null || _a === void 0 ? void 0 : _a.type) !== 'LParen') {
                            outQueue.push(opStack.pop());
                        }
                        break;
                    case 'Operator':
                        while (opStack[opStack.length - 1] &&
                            opStack[opStack.length - 1].type === 'Operator') {
                            const o = opStack[opStack.length - 1];
                            const tAssoc = this.OPS[value].assoc;
                            const tPrec = this.OPS[value].prec;
                            const oPrec = this.OPS[o.value].prec;
                            if (tPrec < oPrec || (tAssoc === 'left' && tPrec === oPrec)) {
                                outQueue.push(opStack.pop());
                            }
                            else {
                                break;
                            }
                        }
                        opStack.push(t);
                        break;
                    case 'RParen':
                        while (opStack[opStack.length - 1] &&
                            opStack[opStack.length - 1].type !== 'LParen') {
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
        this.parseToString = (expression) => {
            const out = this.parse(expression);
            if (!out)
                return null;
            const output = out.map((o) => o === null || o === void 0 ? void 0 : o.value).join('');
            return output;
        };
    }
}
exports.default = new Parser();
//# sourceMappingURL=parser.js.map