const tap = require('tap')
const shp = require('../index.js')

tap.test('generate', async (t) => {
    let result = await shp.generate('password');
    t.ok(result.salt);
    t.ok(result.hash);
    t.end();
});

tap.test('verify', async (t) => {
    let result = await shp.generate('password');
    let verified = await shp.verify('password', result.hash, result.salt);
    t.ok(verified);
    t.end();
});

tap.test('verify fail', async (t) => {
    let result = await shp.generate('password');
    let verified = await shp.verify('password2', result.hash, result.salt);
    t.notOk(verified);
    t.end();
});

tap.test('generate fast', async (t) => {
    let result = await shp.generate('password', 'fast');
    t.ok(result.salt);
    t.ok(result.hash);
    t.end();
});

tap.test('verify fast', async (t) => {
    let result = await shp.generate('password', 'fast');
    let verified = await shp.verify('password', result.hash, result.salt, 'fast');
    t.ok(verified);
    t.end();
});

tap.test('generate fastest', async (t) => {
    let result = await shp.generate('password', 'fastest');
    t.ok(result.salt);
    t.ok(result.hash);
    t.end();
});

tap.test('verify fastest', async (t) => {
    let result = await shp.generate('password', 'fastest');
    let verified = await shp.verify('password', result.hash, result.salt, 'fastest');
    t.ok(verified);
    t.end();
});
