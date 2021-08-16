const readline = require('readline');
const pr_str = require('./printer');
const read_form = require('./reader');
const { List, Symbol, Vector, HashMap } = require('./types');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const env = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  pi: Math.PI,
};

const eval_ast = (ast, env) => {
  if (ast instanceof Symbol) {
    const value = env[ast.ast];
    if (value === undefined) {
      throw new Error(`"${ast}" symbol not found`);
    }
    return value;
  }

  if (ast instanceof List) {
    return EVAL(ast, env);
  }

  if (ast instanceof Vector) {
    return new Vector(ast.ast.map((as) => eval_ast(as, env)));
  }

  if (ast instanceof HashMap) {
    const newHash = [];
    for (let [k, v] of ast.hashmap.entries()) {
      newHash.push(EVAL(k, env));
      newHash.push(EVAL(v, env));
    }
    return new HashMap(newHash);
  }

  return ast;
};

const EVAL = (ast, env) => {
  if (!(ast instanceof List)) {
    return eval_ast(ast, env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  const newList = ast.ast.map((as) => eval_ast(as, env));
  return newList[0].apply(null, newList.slice(1));
};

const rep = (str) => pr_str(EVAL(read_form(str), env));

const loop = () => {
  rl.question('user> ', (str) => {
    try {
      console.log(rep(str));
    } catch (error) {
      console.log(error);
    } finally {
      loop();
    }
  });
};

loop();
