import { CensorKeyPipe } from './censor-key.pipe';

describe('CensorKeyPipe', () => {
  it('create an instance', () => {
    const pipe = new CensorKeyPipe();
    expect(pipe).toBeTruthy();
  });
});
