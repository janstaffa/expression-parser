import { Parser } from '../src/index';

test('tries x + 3 in parser(using rpn)', () => {
  expect(Parser.parse('x + 3', 'rpn')).toBe('x3+');
});
test('tries 2x + 3 in parser(using rpn)', () => {
  expect(Parser.parse('2x + 3', 'rpn')).toBe('2x*3+');
});
test('tries 2(x-3) in parser(using rpn)', () => {
  expect(Parser.parse('2(x-3)', 'rpn')).toBe('2x3-*');
});

test('tries sin(x) in parser(using rpn)', () => {
  expect(Parser.parse('sin(x)', 'rpn')).toBe('xsin');
});
test('tries 3+4*2/(1−5)^2^3 in parser(using rpn)', () => {
  expect(Parser.parse('3+4*2/(1−5)^2^3', 'rpn')).toBe('342*15−23^^/+');
});

test('tries 3-5*5 in parser(using rpn)', () => {
  expect(Parser.parse('3-5*5', 'rpn')).toBe('355*-');
});
