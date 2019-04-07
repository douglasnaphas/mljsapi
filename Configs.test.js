/* globals expect */
const Configs = require('./Configs');
describe('Configs/allowedOrigin', () => {
  const defaultAllowedOrigin = 'https://madliberationgame.com';
  test(defaultAllowedOrigin, () => {
    expect(Configs.allowedOrigin(defaultAllowedOrigin)).toEqual(
      defaultAllowedOrigin);
  });
  test('https://madliberationgame.com.attacker.com', () => {
    const origin = 'https://madliberationgame.com.attacker.com';
    expect(Configs.allowedOrigin(origin)).toEqual(defaultAllowedOrigin);
  });
  test('https://api.madliberationgame.com', () => {
    const origin = 'https://api.madliberationgame.com';
    expect(Configs.allowedOrigin(origin)).toEqual(origin);
  });
  test('https://passover.lol.attacker.com', () => {
    const origin = 'https://passover.lol.attacker.com';
    expect(Configs.allowedOrigin(origin)).toEqual(defaultAllowedOrigin);
  });
  test('https://www.passover.lol', () => {
    const origin = 'https://www.passover.lol';
    expect(Configs.allowedOrigin(origin)).toEqual(origin);
  });
  test('https://passover.lol', () => {
    const origin = 'https://passover.lol';
    expect(Configs.allowedOrigin(origin)).toEqual(origin);
  });
});