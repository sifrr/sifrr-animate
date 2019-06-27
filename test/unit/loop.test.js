import { loop, wait } from '../../src/animate';

describe('loop', function() {
  it.skip('loops forever, stops process from ending', async () => {
    let i = 1;
    loop(async () => {
      await wait(50);
      i++;
    });

    await wait(200);
    expect(i).to.be.above(3);
  });
});
