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
test('tries 2(x-2) in parser', () => {
  expect(Parser.parseToString('2(x-2)')).toBe('2x2-*');
});
test('tries 2[x-2] in parser', () => {
  expect(Parser.parseToString('2[x-2]')).toBe('2x2-*');
});
test('tries 2{x-2} in parser', () => {
  expect(Parser.parseToString('2{x-2}')).toBe('2x2-*');
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
test('tries abs(x) (with x: -10) in evaluator', () => {
  expect(Parser.evaluate('abs(x)', { x: -10 })).toBe('10');
});
test('tries sin(x) (with x: 10) in evaluator', () => {
  expect(Parser.evaluate('sin(x)', { x: 10 })).toBe('0.17364817766693033');
});
test('tries cos(x) (with x: 10) in evaluator', () => {
  expect(Parser.evaluate('cos(x)', { x: 10 })).toBe('0.984807753012208');
});
test('tries tan(x) (with x: 10) in evaluator', () => {
  expect(Parser.evaluate('tan(x)', { x: 10 })).toBe('0.17632698070846498');
});
test('tries min(5, 10) in evaluator', () => {
  expect(Parser.evaluate('min(5, 10)')).toBe('5');
});
test('tries max(5, 10) in evaluator', () => {
  expect(Parser.evaluate('max(5, 10)')).toBe('10');
});
test('tries sqrt(9) in evaluator', () => {
  expect(Parser.evaluate('sqrt(9)')).toBe('3');
});
test('tries root(8, 3) in evaluator', () => {
  expect(Parser.evaluate('root(8, 3)')).toBe('2');
});
test('tries mod(25, 6) in evaluator', () => {
  expect(Parser.evaluate('mod(25, 7)')).toBe('4');
});
test('tries mod(25, 5) in evaluator', () => {
  expect(Parser.evaluate('mod(25, 5)')).toBe('0');
});
test('tries 3+4*2/(1-5)^2^3 in evaluator', () => {
  expect(Parser.evaluate('3+4*2/(1-5)^2^3')).toBe('3.0001220703125');
});
test('tries 2(5-2) in parser', () => {
  expect(Parser.evaluate('2(5-2)')).toBe('6');
});
test('tries 2[5-2] in parser', () => {
  expect(Parser.evaluate('2[5-2]')).toBe('6');
});
test('tries 2{5-2} in parser', () => {
  expect(Parser.evaluate('2{5-2}')).toBe('6');
});
test('tries |x| in parser', () => {
  expect(Parser.evaluate('|x|', { x: -5 })).toBe('5');
});
