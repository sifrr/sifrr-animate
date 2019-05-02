const FRAME_TIME = 20;

describe('animate', () => {
  before(async () => {
    await page.goto(`${PATH}/index.html`);
  });

  it('works with single target', async () => {
    const { i, target } = await page.evaluate(async () => {
      let i = 0, onUpdate = () => i++;
      let target = { a: 0 };
      await animate({
        target,
        to: {
          a: 100
        },
        onUpdate
      });

      return { i, target };
    });

    expect(i).to.be.at.least(300/FRAME_TIME);
    expect(target).to.deep.equal({ a: 100 });
  });

  it('works without from', async () => {
    const { i, target } = await page.evaluate(async () => {
      let i = 0, onUpdate = () => i++;
      let target = {};
      await animate({
        target,
        to: {
          a: 100
        },
        time: 100,
        onUpdate
      });

      return { i, target };
    });

    expect(i).to.be.at.least(100/FRAME_TIME);
    expect(target).to.deep.equal({ a: 100 });
  });

  it('works with from in array', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [], onUpdate = function(target, prop, val) {
        calls.push(val);
      };
      let target = {};
      await animate({
        target,
        to: {
          a: [1000, 1100]
        },
        time: 100,
        onUpdate
      });

      return calls;
    });

    expect(calls.length).to.be.at.least(100/FRAME_TIME);
    expect(calls[0]).to.be.at.least(1000);
    expect(calls[calls.length - 1]).to.equal(1100);
  });

  it('works with string', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [], onUpdate = function(target, prop, val) {
        calls.push(val);
      };
      let target = {
        a: 'acd10bcc100'
      };
      await animate({
        target,
        to: {
          a: 'acd15bcc159'
        },
        time: 100,
        onUpdate
      });

      return calls;
    });

    expect(calls.length).to.be.at.least(100/FRAME_TIME);
    expect(calls[0]).to.not.equal('acd15bcc159');
    expect(calls[calls.length - 1]).to.equal('acd15bcc159');

    const callBreak = calls[0].split(/(\d+)/);
    expect(Number(callBreak[1])).to.be.at.least(10);
    expect(Number(callBreak[3])).to.be.at.least(100);
  });

  it('works with string, no from value', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [], onUpdate = function(target, prop, val) {
        calls.push(val);
      };
      let target = {
      };
      await animate({
        target,
        to: {
          a: 'acd15bcc159'
        },
        time: 100,
        onUpdate
      });

      return calls;
    });

    expect(calls.length).to.be.at.least(100/FRAME_TIME);
    expect(calls[0]).to.not.equal('acd15bcc159');
    expect(calls[calls.length - 1]).to.equal('acd15bcc159');

    const callBreak = calls[0].split(/(\d+)/);
    expect(Number(callBreak[1])).to.be.at.least(0);
    expect(Number(callBreak[3])).to.be.at.least(0);
  });

  it('rounds off', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [], onUpdate = function(target, prop, val) {
        calls.push(val);
      };
      let target = {};
      await animate({
        target,
        to: {
          a: 100
        },
        time: 100,
        onUpdate,
        round: true
      });

      return calls;
    });

    expect(calls.length).to.be.at.least(100/FRAME_TIME);
    expect(calls[1].toString().indexOf('.')).to.equal(-1);
  });

  it('works with bezier type', async () => {
    const target = await page.evaluate(async () => {
      let target = {};
      await animate({
        target,
        to: {
          a: 100
        },
        time: 10,
        type: [0, 0.1, 0.4, 0.5]
      });

      return target;
    });

    expect(target).to.deep.equal({ a: 100 });
  });

  it('works with function type', async () => {
    const target = await page.evaluate(async () => {
      let target = {};
      await animate({
        target,
        to: {
          a: 100
        },
        time: 10,
        type: (x) => 10 * x
      });

      return target;
    });

    expect(target).to.deep.equal({ a: 1000 });
  });
});
