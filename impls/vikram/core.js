const { Env } = require('./env');
const pr_str = require('./printer');
const { Symbol, Fn, Nil, List } = require('./types');

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
coreEnv.set(
  new Symbol('list'),
  new Fn((...args) => {
    return new List(args);
  })
);
coreEnv.set(
  new Symbol('list?'),
  new Fn((...args) => {
    return args[0] instanceof List;
  })
);

module.exports = { coreEnv };
