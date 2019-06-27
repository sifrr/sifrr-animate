/* global animate */
const FRAME_TIME = 20;

describe('animate', () => {
  before(async () => {
    await page.goto(`${PATH}/index.html`);
  });

  it('works with single target', async () => {
    const { i, target } = await page.evaluate(async () => {
      let i = 0,
        onUpdate = () => i++;
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

    expect(i).to.be.at.least(300 / FRAME_TIME);
    expect(target).to.deep.equal({ a: 100 });
  });

  it('works even if one animation errors', async () => {
    const { i, target, error } = await page.evaluate(async () => {
      let target = { a: 0 },
        i = 0,
        onUpdate = () => i++,
        error;
      await animate({
        target: 'ok',
        to: {
          data: 100
        }
      }).catch(e => (error = e));
      await animate({
        target,
        to: {
          a: 100
        },
        onUpdate
      });

      return { i, target, error };
    });

    expect(i).to.be.at.least(300 / FRAME_TIME);
    expect(target).to.deep.equal({ a: 100 });
    expect(error).to.exist;
  });

  it('works with single digit', async () => {
    const { i, target } = await page.evaluate(async () => {
      let i = 0,
        onUpdate = () => i++;
      let target = { a: 0 };
      await animate({
        target,
        to: {
          a: 9
        },
        onUpdate,
        time: 100
      });

      return { i, target };
    });

    expect(i).to.be.at.least(100 / FRAME_TIME);
    expect(target).to.deep.equal({ a: 9 });
  });

  it('works without from', async () => {
    const { i, target } = await page.evaluate(async () => {
      let i = 0,
        onUpdate = () => i++;
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

    expect(i).to.be.at.least(100 / FRAME_TIME);
    expect(target).to.deep.equal({ a: 100 });
  });

  it('works with from in array', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [],
        onUpdate = function(target, prop, val) {
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

    expect(calls.length).to.be.at.least(100 / FRAME_TIME);
    expect(calls[0]).to.be.at.least(1000);
    expect(calls[calls.length - 1]).to.equal(1100);
  });

  it('works with string', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [],
        onUpdate = function(target, prop, val) {
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

    expect(calls.length).to.be.at.least(100 / FRAME_TIME);
    expect(calls[0]).to.not.equal('acd15bcc159');
    expect(calls[calls.length - 1]).to.equal('acd15bcc159');

    const callBreak = calls[0].split(/(\d+)/);
    expect(Number(callBreak[1])).to.be.at.least(10);
    expect(Number(callBreak[3])).to.be.at.least(100);
  });

  it('works with decimal string', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [],
        onUpdate = function(target, prop, val) {
          calls.push(val);
        };
      let target = {
        a: '0.567px'
      };
      await animate({
        target,
        to: {
          a: '145.567px'
        },
        time: 100,
        onUpdate
      });

      return calls;
    });

    expect(calls.length).to.be.at.least(100 / FRAME_TIME);
    expect(calls[0]).to.not.equal('145.567px');
    expect(calls[calls.length - 1]).to.equal('145.567px');

    const callBreak = calls[0].split(/(\d+.?\d+)/);
    expect(Number(callBreak[1])).to.be.at.least(0);
    expect(Number(callBreak[1])).to.be.at.most(145);
    expect(calls[0].match(/\./g).length).to.equal(1);
  });

  it('works with string, no from value', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [],
        onUpdate = function(target, prop, val) {
          calls.push(val);
        };
      let target = {};
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

    expect(calls.length).to.be.at.least(100 / FRAME_TIME);
    expect(calls[0]).to.not.equal('acd15bcc159');
    expect(calls[calls.length - 1]).to.equal('acd15bcc159');

    const callBreak = calls[0].split(/(\d+)/);
    expect(Number(callBreak[1])).to.be.at.least(0);
    expect(Number(callBreak[3])).to.be.at.least(0);
  });

  it('rounds off', async () => {
    const calls = await page.evaluate(async () => {
      let calls = [],
        onUpdate = function(target, prop, val) {
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

    expect(calls.length).to.be.at.least(100 / FRAME_TIME);
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
        type: x => 10 * x
      });

      return target;
    });

    expect(target).to.deep.equal({ a: 1000 });
  });

  it('calculates relative numbers', async () => {
    const t1 = await page.evaluate(async () => {
      let target = {};
      await animate({
        target,
        to: {
          a: [89, '+=100']
        },
        time: 0
      });

      return target;
    });

    expect(t1).to.deep.equal({ a: 189 });

    const t2 = await page.evaluate(async () => {
      let target = {};
      await animate({
        target,
        to: {
          a: [89, '-=100']
        },
        time: 0
      });

      return target;
    });

    expect(t2).to.deep.equal({ a: -11 });

    const t3 = await page.evaluate(async () => {
      let target = {};
      await animate({
        target,
        to: {
          a: [90, '*=2']
        },
        time: 0
      });

      return target;
    });

    expect(t3).to.deep.equal({ a: 180 });

    const t4 = await page.evaluate(async () => {
      let target = {};
      await animate({
        target,
        to: {
          a: [100, '/=10']
        },
        time: 0
      });

      return target;
    });

    expect(t4).to.deep.equal({ a: 10 });
  });
});
