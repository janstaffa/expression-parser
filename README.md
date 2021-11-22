# expression-parser

Math expression parser implementation in Typescript.
## install
```console
// with yarn (prefered)
yarn add janstaffa/expression-parser

// with npm
npm install https://github.com/janstaffa/expression-parser

```
## API

```js
import Parser from 'expression-parser';

// evaluate an expression
Parser.evaluate('EXPRESSION', {
  // variable values if you use variables in the expression
  x: 5,
  y: 5
  ...
}, PARSER_OPTIONS);

// parse an expression into RPN(Reverse Polish notation)
Parser.parse('EXPRESSION');
```
### options
| option     | description                                        | default |
|------------|----------------------------------------------------|---------|
| useRadians | if enabled calculates angle functions with radians | false   |
| decimals   | number of decimal places of result                 | 4       |

## features

### 1. simple operations
```js
>> Parser.evaluate('10+10');
>> 20

>> Parser.evaluate('5-10');
>> -5
```

### 2. variables
```js
>> Parser.evaluate('x', { x: 10 });
>> 10

>> Parser.evaluate('x-y', { x: 10, y: 5 });
>> 5
```

### 3. operators
| symbol | operation | usage     |
|--------|-----------|-----------|
| +      | add       | 1+1 => 2  |
| -      | substract | 2-1 => 1  |
| *      | multiply  | 2*2 => 4  |
| /      | divide    | 10/5 => 2 |
| ^      | power     | 2^3 => 8  |
| !      | factorial | 5! => 120 |

### 4. functions
| function | description              | usage               |
|----------|--------------------------|---------------------|
| sqrt     | sqare root               | sqrt(9) => 3        |
| root     | any root                 | root(8, 3) => 2     |
| sin      | sine value               | sin(90) => 1        |
| cos      | cosine value             | cos(60) => 0.5      |
| tan      | tangens value            | tan(45) => 1        |
| abs      | absolute value           | abs(-5) => 5        |
| max      | greater of two           | max(5, 10) => 10    |
| min      | smaller of two           | min(5, 10) => 5     |
| mod      | modulo                   | mod(10, 3) => 1     |
| fac      | factorial                | fac(5) or 5! => 120 |
| round    | round to closest number  | round(0.9) => 1     |
| int      | removes all decimals     | int(0.9) => 0       |

### 5. complex operations
```js
>> Parser.evaluate('max(x, 5)(2abs(x-y)*x/y^2)+1/2', {x: 2, y: 4});
>> 3

```
