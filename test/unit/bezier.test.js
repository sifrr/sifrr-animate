import Bezier from '../../src/bezier';

describe('Bezier', function() {
  it('has correct values', async () => {
    const bezier = new Bezier([0.5, 0.5, 0.5, 0.5]);

    expect(bezier(0.1)).to.equal(0.1);
    expect(bezier(0.6)).to.equal(0.6);
    expect(bezier(1)).to.equal(1);

    const bezier1 = new Bezier([0.17, 0.67, 0.83, 0.67]);
    expect(Math.round(bezier1(0.3) * 100) / 100).to.equal(0.49);
    expect(Math.round(bezier1(0.7) * 100) / 100).to.equal(0.74);
    expect(Math.round(bezier1(1) * 100) / 100).to.equal(1);

    const bezier2 = new Bezier([0, 1, 0, 1]);
    expect(Math.round(bezier2(0) * 100) / 100).to.equal(0);
  });

  it('returns memoized values', async () => {
    const bezier1 = new Bezier([0.1, 0.9, 0.3, 0.7]);
    const bezier2 = new Bezier([0.1, 0.9, 0.3, 0.7]);
    const bezier3 = new Bezier([0.1, 0.9, 0.3, 0.7]);

    expect(bezier1).to.equal(bezier2);
    expect(bezier1).to.equal(bezier3);
  });
});
