const { add, subtract, multiply, divide } = require('../../app/src/calculator');

describe('Calculator', () => {
  test('add two positives', () => expect(add(2, 3)).toBe(5));
  test('add negatives', () => expect(add(-1, -2)).toBe(-3));
  test('subtract', () => expect(subtract(5, 3)).toBe(2));
  test('multiply', () => expect(multiply(3, 4)).toBe(12));
  test('multiply by zero', () => expect(multiply(5, 0)).toBe(0));
  test('divide', () => expect(divide(10, 2)).toBe(5));
  test('divide by zero throws', () => expect(() => divide(1, 0)).toThrow('Division by zero'));
});
