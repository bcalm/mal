const { Env } = require('./env');
const pr_str = require('./printer');
const { Symbol, Fn, Nil, List, Vector } = require('./types');

const coreEnv = new Env(null);

coreEnv.set(new Symbol('+'), new Fn((a, b) => a + b));
coreEnv.set(new Symbol('-'), new Fn((a, b) => a - b));
coreEnv.set(new Symbol('*'), new Fn((a, b) => a * b));
coreEnv.set(new Symbol('/'), new Fn((a, b) => a / b));
coreEnv.set(new Symbol('pi'), Math.PI);
coreEnv.set(
  new Symbol('prn'),
  new Fn((...args) => {
    if (args[0]) {
      console.log(pr_str(args[0]));
    }
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
coreEnv.set(
  new Symbol('empty?'),
  new Fn((...args) => {
    return args[0].isEmpty();
  })
);
coreEnv.set(
  new Symbol('count'),
  new Fn((...args) => {
    return args[0] instanceof Nil ? 0 : args[0].length();
  })
);
coreEnv.set(
  new Symbol('='),
  new Fn((...args) => {
    return args[0].toString() === args[1].toString();
  })
);
coreEnv.set(
  new Symbol('<'),
  new Fn((...args) => {
    return args[0] < args[1];
  })
);
coreEnv.set(
  new Symbol('<='),
  new Fn((...args) => {
    return args[0] <= args[1];
  })
);
coreEnv.set(
  new Symbol('>'),
  new Fn((...args) => {
    return args[0] > args[1];
  })
);
coreEnv.set(
  new Symbol('>='),
  new Fn((...args) => {
    return args[0] >= args[1];
  })
);
coreEnv.set(
  new Symbol('str'),
  new Fn((...args) => {
    return args.reduce((arg, string) => string + arg, '');
  })
);
coreEnv.set(
  new Symbol('println'),
  new Fn((...args) => {
    const result = [];
    args.forEach((arg) => {
      result.push(pr_str(arg));
    });
    console.log(result.join(' '));
    return new Nil();
  })
);
coreEnv.set(
  new Symbol('pr-str'),
  new Fn((...args) => {
    const result = [];
    args.forEach((arg) => {
      result.push(pr_str(arg));
    });
    return result.join(' ');
  })
);

module.exports = { coreEnv };
