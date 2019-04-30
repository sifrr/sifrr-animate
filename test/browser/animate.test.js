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

    expect(i).to.be.at.least(300/30);
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

    expect(i).to.be.at.least(100/30);
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
          a: [100, 500]
        },
        time: 100,
        onUpdate
      });

      return calls;
    });

    expect(calls.length).to.be.at.least(100/30);
    expect(calls[0]).to.equal(100);
    expect(calls[calls.length - 1]).to.equal(500);
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

    expect(calls.length).to.be.at.least(100/30);
    expect(calls[0]).to.equal('acd10bcc100');
    expect(calls[calls.length - 1]).to.equal('acd15bcc159');

    const callBreak = calls[1].split(/(\d+)/);
    expect(Number(callBreak[1])).to.be.at.least(11);
    expect(Number(callBreak[3])).to.be.at.least(101);
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

    expect(calls.length).to.be.at.least(100/30);
    expect(calls[0]).to.equal('acd0bcc0');
    expect(calls[calls.length - 1]).to.equal('acd15bcc159');

    const callBreak = calls[1].split(/(\d+)/);
    expect(Number(callBreak[1])).to.be.at.least(1);
    expect(Number(callBreak[3])).to.be.at.least(1);
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

    expect(calls.length).to.be.at.least(100/30);
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
