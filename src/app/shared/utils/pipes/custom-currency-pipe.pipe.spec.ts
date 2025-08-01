import { CustomCurrencyPipe } from './custom-currency-pipe.pipe';

describe('CustomCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
