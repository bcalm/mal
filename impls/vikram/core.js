const { Env } = require('./env');
const pr_str = require('./printer');
const { Symbol, Fn, Nil } = require('./types');

const coreEnv = new Env(null);

coreEnv.set(new Symbol('+'), new Fn((a, b) => a + b));
coreEnv.set(new Symbol('-'), new Fn((a, b) => a - b));
coreEnv.set(new Symbol('*'), new Fn((a, b) => a * b));
coreEnv.set(new Symbol('/'), new Fn((a, b) => a / b));
coreEnv.set(new Symbol('pi'), Math.PI);
coreEnv.set(
  new Symbol('prn'),
  new Fn((...args) => {
    console.log(pr_str(args[0]));
    return new Nil();
  })
);

module.exports = { coreEnv };
