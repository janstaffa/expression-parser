"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = exports.isOperator = exports.isChar = exports.isLiteral = exports.Token = void 0;
class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
exports.Token = Token;
const isLiteral = (str) => /\d|\./.test(str);
exports.isLiteral = isLiteral;
const isChar = (str) => /[a-z]/i.test(str);
exports.isChar = isChar;
const isOperator = (str) => /\+|\-|\*|\/|\^/.test(str);
exports.isOperator = isOperator;
const isFunction = (str) => /^(sin|cos|tan|min|max|mod|sqrt|root|abs|fac|round|int)$/.test(str);
exports.isFunction = isFunction;
const leftBracketRegex = /\(|\[|\{/;
const rightBracketRegex = /\)|\]|\}/;
class Tokenizer {
    constructor() {
        this.tokenize = (expression) => {
            var _a, _b, _c;
            const trimmedExpression = expression.replace(/\s+/g, '');
            const output = [];
            let charBuffer = '';
            let literalBuffer = '';
            let multiplyBuffer = [];
            const tokens = trimmedExpression.split('');
            for (const [idx, char] of tokens.entries()) {
                const isLast = idx === trimmedExpression.length - 1;
                if ((0, exports.isChar)(char)) {
                    charBuffer += char;
                    if (!isLast)
                        continue;
                }
                else if ((0, exports.isLiteral)(char)) {
                    literalBuffer += char;
                    if (!isLast)
                        continue;
                }
                if (charBuffer.length > 0) {
                    if (literalBuffer.length > 0) {
                        multiplyBuffer.push(new Token('Literal', literalBuffer));
                        literalBuffer = '';
                    }
                    if ((0, exports.isFunction)(charBuffer)) {
                        if (multiplyBuffer.length > 0) {
                            multiplyBuffer.push(new Token('Function', charBuffer));
                        }
                        else {
                            output.push(new Token('Function', charBuffer));
                        }
                    }
                    else {
                        if (charBuffer.length > 1 || leftBracketRegex.test(char)) {
                            for (const v of charBuffer) {
                                multiplyBuffer.push(new Token('Var', v));
                            }
                        }
                        else if (multiplyBuffer.length > 0) {
                            multiplyBuffer.push(new Token('Var', charBuffer));
                        }
                        else {
                            output.push(new Token('Var', charBuffer));
                        }
                    }
                    charBuffer = '';
                }
                if (literalBuffer.length > 0) {
                    if (leftBracketRegex.test(char) || multiplyBuffer.length > 0) {
                        multiplyBuffer.push(new Token('Literal', literalBuffer));
                    }
                    else {
                        output.push(new Token('Literal', literalBuffer));
                    }
                    literalBuffer = '';
                }
                if (multiplyBuffer.length > 0) {
                    for (const [i, token] of multiplyBuffer.entries()) {
                        output.push(token);
                        if (i < multiplyBuffer.length - 1 ||
                            (token.type !== 'Function' && leftBracketRegex.test(char))) {
                            output.push(new Token('Operator', '*'));
                        }
                    }
                    multiplyBuffer = [];
                }
                if ((0, exports.isOperator)(char)) {
                    const prevToken = output[output.length - 1];
                    if (char === '-' &&
                        (!prevToken || leftBracketRegex.test(prevToken.value))) {
                        multiplyBuffer.push(new Token('Literal', '-1'));
                    }
                    else {
                        output.push(new Token('Operator', char));
                    }
                }
                else if (leftBracketRegex.test(char)) {
                    if (rightBracketRegex.test((_a = output[output.length - 1]) === null || _a === void 0 ? void 0 : _a.value)) {
                        output.push(new Token('Operator', '*'));
                    }
                    output.push(new Token('LParen', char));
                }
                else if (rightBracketRegex.test(char)) {
                    output.push(new Token('RParen', char));
                }
                else if (char === ',') {
                    output.push(new Token('ArgumentSeparator', char));
                }
                else if (char === '!') {
                    const lastChar = (_b = output[output.length - 1]) === null || _b === void 0 ? void 0 : _b.value;
                    if (!lastChar)
                        continue;
                    const originalLength = output.length;
                    let i = 1;
                    if (rightBracketRegex.test(lastChar)) {
                        while (!leftBracketRegex.test((_c = output[output.length - i]) === null || _c === void 0 ? void 0 : _c.value)) {
                            if (i > 500)
                                throw new Error('Too many iterations.');
                            i++;
                        }
                    }
                    else {
                        output.splice(originalLength - i, 0, new Token('LParen', '('));
                        output.push(new Token('RParen', ')'));
                    }
                    output.splice(originalLength - i, 0, new Token('Function', 'fac'));
                }
                else {
                    if (!(0, exports.isLiteral)(char) && !(0, exports.isChar)(char)) {
                        throw new Error(`Unknown token '${char}'`);
                    }
                }
            }
            for (const token of output) {
                if (token.type === 'Var') {
                    if (token.value.length !== 1) {
                        throw new Error('Variables can only be 1 character long.');
                    }
                }
            }
            return output;
        };
        this.tokenizeToString = (expression) => {
            const arr = this.tokenize(expression);
            return arr.map((t) => t.value).join('');
        };
    }
}
exports.default = new Tokenizer();
//# sourceMappingURL=tokenizer.js.map