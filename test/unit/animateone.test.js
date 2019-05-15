describe('animateOne', function() {
  it('throws error if type is not correct', async () => {
    let error;
    global.window = {
      requestAnimationFrame: () => {}
    };
    const animateOne = require('../../src/animateone');

    await animateOne({
      target: {},
      prop: 'c',
      to: 10,
      type: 123
    }).catch(e => error = e);

    expect(error).to.exist;
  });
});
