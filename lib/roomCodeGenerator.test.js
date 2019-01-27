/*global expect*/

const roomCodeGenerator = require('./roomCodeGenerator.js');

describe('roomCodeGenerator', () => {
  test('the Room Code should be the requested number of digits (6)', () => {
    const options = { digits: 6 };
    const g = roomCodeGenerator(options);
    const str = g.next().value;
    expect(str).toMatch(/[A-Z]{6}/);
    
  });
  test('the Room Code should be the requested number of digits (7)', () => {
    const options = { digits: 7 };
    const g = roomCodeGenerator(options);
    const str = g.next().value;
    expect(str).toMatch(/[A-Z]{7}/);
  });
});