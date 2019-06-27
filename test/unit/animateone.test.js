global.window = {
  requestAnimationFrame: () => {}
};

describe('animateOne', function() {
  it('throws error if type is not correct', async () => {
    let error;
    const animateOne = require('../../src/animateone').default;
    await animateOne({
      target: {},
      prop: 'c',
      to: 10,
      type: 123
    }).catch(e => (error = e));

    expect(error).to.exist;
  });
});
