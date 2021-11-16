import { Parser } from '../src/index';

// parsing tests
test('tries x + 3 in parser', () => {
  expect(Parser.parseToString('x + 3')).toBe('x3+');
});
test('tries 2x + 3 in parser', () => {
  expect(Parser.parseToString('2x + 3')).toBe('2x*3+');
});
test('tries 2(x-3) in parser', () => {
  expect(Parser.parseToString('2(x-3)')).toBe('2x3-*');
});

test('tries sin(x) in parser', () => {
  expect(Parser.parseToString('sin(x)')).toBe('xsin');
});
test('tries 3+4*2/(1-5)^2^3 in parser', () => {
  expect(Parser.parseToString('3+4*2/(1-5)^2^3')).toBe('342*15-23^^/+');
});

test('tries 3-5*5 in parser', () => {
  expect(Parser.parseToString('3-5*5')).toBe('355*-');
});

test('tries sin(max(2, 3)/3*x) in parser', () => {
  expect(Parser.parseToString('sin(max(2, 3)/3*x)')).toBe('23max3/x*sin');
});

// evaluation tests
test('tries 5+5 in evaluator', () => {
  expect(Parser.evaluate('5+5')).toBe('10');
});
test('tries 5-5 in evaluator', () => {
  expect(Parser.evaluate('5-5')).toBe('0');
});
test('tries 1-5 in evaluator', () => {
  expect(Parser.evaluate('1-5')).toBe('-4');
});
test('tries x^2 (with x: 2) in evaluator', () => {
  expect(Parser.evaluate('x^2', { x: 2 })).toBe('4');
});
test('tries 2x(x-5)^2 (with x: 10) in evaluator', () => {
  expect(Parser.evaluate('2x(x-5)^2', { x: 10 })).toBe('500');
});
