const { Env } = require('./env');
const { Symbol, Fn } = require('./types');

const coreEnv = new Env(null);

coreEnv.set(new Symbol('+'), new Fn((a, b) => a + b));
coreEnv.set(new Symbol('-'), new Fn((a, b) => a - b));
coreEnv.set(new Symbol('*'), new Fn((a, b) => a * b));
coreEnv.set(new Symbol('/'), new Fn((a, b) => a / b));
coreEnv.set(new Symbol('pi'), Math.PI);

module.exports = { coreEnv };
