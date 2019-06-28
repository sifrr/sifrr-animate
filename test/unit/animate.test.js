const mock = require('mock-require');
mock('../../src/animateone', sinon.spy());
const { animate, keyframes, animateOne } = require('../../src/animate');

function removeUndefined(obj) {
  const newObj = {};
  for (let p in obj) {
    if (obj[p] !== undefined) newObj[p] = obj[p];
  }
  return newObj;
}

describe('animate', function() {
  after(() => {
    sinon.restore();
    mock.stop('../../src/animateone');
  });

  afterEach(() => {
    animateOne.resetHistory();
  });

  it('calls animateOne with given properties', async () => {
    const target = {
      a: {
        d: 0
      }
    };

    animate({
      target,
      to: {
        b: 1000,
        a: {
          d: 10
        }
      },
      time: 300,
      type: 'ease',
      round: true
    });

    expect(animateOne.callCount).to.equal(2);
    expect(removeUndefined(animateOne.args[0][0])).to.deep.equal({
      target: target,
      prop: 'b',
      to: 1000,
      time: 300,
      type: 'ease',
      round: true
    });
    expect(removeUndefined(animateOne.args[1][0])).to.deep.equal({
      target: target['a'],
      prop: 'd',
      to: 10,
      time: 300,
      type: 'ease',
      round: true
    });
  });

  it('calls animateOne with from value if given', async () => {
    const target = {};

    animate({
      target,
      to: {
        c: [10, 100]
      },
      time: 300,
      type: 'ease',
      round: true
    });

    expect(animateOne.callCount).to.equal(1);
    expect(removeUndefined(animateOne.args[0][0])).to.deep.equal({
      target,
      prop: 'c',
      to: 100,
      time: 300,
      type: 'ease',
      from: 10,
      round: true
    });
  });

  it('calls animateOne for multiple targets', async () => {
    const targets = [{}, {}, {}];

    animate({
      targets,
      to: {
        a: 10
      },
      time: 300
    });

    expect(animateOne.callCount).to.equal(3);
    targets.forEach((t, i) => {
      expect(removeUndefined(animateOne.args[i][0])).to.deep.equal({
        target: t,
        prop: 'a',
        to: 10,
        time: 300
      });
    });
  });

  it('works with functions', async () => {
    const target = {};
    let ii, jj, kk;
    animate({
      target,
      to: i => {
        ii = i;
        return {
          a: 10
        };
      },
      time: j => {
        jj = j;
        return 300;
      },
      delay: k => {
        kk = k;
        return 0;
      }
    });

    expect(animateOne.callCount).to.equal(1);
    expect(removeUndefined(animateOne.args[0][0])).to.deep.equal({
      target,
      prop: 'a',
      to: 10,
      time: 300,
      delay: 0
    });
    expect(ii).to.equal(0);
    expect(jj).to.equal(0);
    expect(kk).to.equal(0);
  });

  it('works with keyframes', async () => {
    const target = {};
    await keyframes([
      {
        target,
        to: { a: 1 },
        time: 1,
        delay: 1
      },
      {
        target,
        to: { a: 2 },
        time: 1,
        delay: 1
      },
      [
        {
          target,
          to: { a: 3 },
          time: 1,
          delay: 1
        },
        {
          target,
          to: { a: 4 },
          time: 1,
          delay: 1
        }
      ]
    ]);

    expect(animateOne.callCount).to.equal(4);
    for (let i = 0; i < 4; i++) {
      expect(removeUndefined(animateOne.args[i][0])).to.deep.equal({
        target,
        prop: 'a',
        to: i + 1,
        time: 1,
        delay: 1
      });
    }
  });
});
