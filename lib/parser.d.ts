import { Token } from './tokenizer';
declare class Parser {
    private OPS;
    private FUNC_ARGS;
    evaluate: (expression: string, unknowns?: {
        [key: string]: number;
    } | undefined, options?: {
        useRadians?: boolean | undefined;
        decimals?: number | undefined;
    } | undefined) => number;
    parse: (expression: string) => (Token | undefined)[];
    parseToString: (expression: string) => string | null;
}
declare const _default: Parser;
export default _default;
