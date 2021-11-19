declare const _default: {
    evaluate: (expression: string, unknowns?: {
        [key: string]: number;
    } | undefined, options?: {
        useRadians?: boolean | undefined;
        decimals?: number | undefined;
    } | undefined) => number;
    parse: (expression: string) => string | null;
};
export default _default;
