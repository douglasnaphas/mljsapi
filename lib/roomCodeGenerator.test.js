/*global expect*/

const roomCodeGenerator = require('./roomCodeGenerator.js');

describe('roomCodeGenerator', () => {
  test('the Room Code should be the requested number of letters (6)', () => {
    const options = { letters: 6 };
    const g = roomCodeGenerator(options);
    const str = g.next().value;
    expect(str).toMatch(/[A-Z]{6}/);
    
  });
  test('the Room Code should be the requested number of letters (7)', () => {
    const options = { letters: 7 };
    const g = roomCodeGenerator(options);
    const str = g.next().value;
    expect(str).toMatch(/[A-Z]{7}/);
  });
  test('5 6-letter room codes should not all be the same', () => {
    const options = { letters: 6 };
    const g = roomCodeGenerator(options);
    const codes = [];
    for(let i = 0; i < 5; i++) {
      codes[i] = g.next().value;
    }
    codes.sort();
    for(let i = 0; i < codes.length - 1; i++) {
      console.log(codes);
      expect(codes[i] == codes[i + 1]).toBeFalsy();
    }
  });
});