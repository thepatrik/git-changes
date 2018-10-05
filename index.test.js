const gitchanges = require('./index');

test('Get changes since v1.0.1', () => {
    const opts = {
        since: 'v1.0.1',
        silent: true
    };
    let changes = gitchanges(opts);
    expect(changes).toBeDefined();
});
