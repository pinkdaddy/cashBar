const isPositive = require('../isPositive');

describe('isPositive should calculate if input is positive or not', () => {
  test('should return true if number is positive', () => {
    expect(isPositive(0.1)).toBeTruthy();
    expect(isPositive(1.0)).toBeTruthy();
    expect(isPositive(1.1)).toBeTruthy();

    expect(isPositive('0.1')).toBeTruthy();
    expect(isPositive('1.0')).toBeTruthy();
    expect(isPositive('1.1')).toBeTruthy();
  });

  test('should return false if number is negative or 0', () => {
    expect(isPositive(-0.1)).toBeFalsy();
    expect(isPositive(-1.0)).toBeFalsy();
    expect(isPositive(-1.1)).toBeFalsy();

    expect(isPositive('-0.1')).toBeFalsy();
    expect(isPositive('-1.0')).toBeFalsy();
    expect(isPositive('-1.1')).toBeFalsy();
  });
});
