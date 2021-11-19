"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("./parser"));
const evaluate = parser_1.default.evaluate;
const parse = parser_1.default.parseToString;
exports.default = { evaluate, parse };
//# sourceMappingURL=index.js.map