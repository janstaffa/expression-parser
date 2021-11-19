declare type TokenType = 'Literal' | 'Operator' | 'Function' | 'ArgumentSeparator' | 'LParen' | 'RParen' | 'Var';
export declare class Token {
    type: TokenType;
    value: string;
    constructor(type: TokenType, value: string);
}
export declare const isLiteral: (str: string) => boolean;
export declare const isChar: (str: string) => boolean;
export declare const isOperator: (str: string) => boolean;
export declare const isFunction: (str: string) => boolean;
declare class Tokenizer {
    tokenize: (expression: string) => Token[];
    tokenizeToString: (expression: string) => string;
}
declare const _default: Tokenizer;
export default _default;
