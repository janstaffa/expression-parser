import { Tokenizer } from '../src/index';
test('tries x + 1 in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('x + 1')).toBe('x+1');
});
test('tries 2x in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('2x')).toBe('2*x');
});
test('tries sin(x) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('sin(x)')).toBe('sin(x)');
});
test('tries 2x(x-2) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('2x(x-2)')).toBe('2*x*(x-2)');
});
test('tries x*x/2x in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('x*x/2x')).toBe('x*x/2*x');
});
test('tries 2sin(x) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('2sin(x)')).toBe('2*sin(x)');
});
test('tries xy in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('xy')).toBe('x*y');
});
test('tries 2xy in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('2xy')).toBe('2*x*y');
});
test('tries (2x-5/3x)*2x in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('(2x-5/3x)*2x')).toBe('(2*x-5/3*x)*2*x');
});
test('tries (2x-5/3x)(2-5) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('(2x-5/3x)(2-5)')).toBe(
    '(2*x-5/3*x)*(2-5)'
  );
});
test('tries -x in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('-x')).toBe('-1*x');
});
test('tries -x+2 in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('-x+2')).toBe('-1*x+2');
});
test('tries x(-x+2) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('x(-x+2)')).toBe('x*(-1*x+2)');
});
test('tries -x(x+2) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('-x(x+2)')).toBe('-1*x*(x+2)');
});
test('tries xysin(x) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('xysin(x)')).toBe('x*y*s*i*n*(x)');
});
test('tries min(x, 5) in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('min(x, 5)')).toBe('min(x,5)');
});
test('tries 3+4*2/(1-5)^2^3 in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('3+4*2/(1-5)^2^3')).toBe('3+4*2/(1-5)^2^3');
});
test('tries |x-5| in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('|x-5|')).toBe('|x-5|');
});
test('tries ||x-5|-1| in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('||x-5|-1|')).toBe('||x-5|-1|');
});
test('tries -1 in tokenizer', () => {
  expect(Tokenizer.tokenizeToString('-1')).toBe('-1*1');
});
