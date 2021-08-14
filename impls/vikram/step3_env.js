const readline = require('readline');
const { Env } = require('./env');
const pr_str = require('./printer');
const read_form = require('./reader');
const { List, Symbol, Vector, HashMap } = require('./types');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast instanceof Symbol) return env.get(ast.ast);

  if (ast instanceof List) return EVAL(ast, env);

  if (ast instanceof Vector)
    return new Vector(ast.ast.map((as) => eval_ast(as, env)));

  if (ast instanceof HashMap) {
    const newHash = [];
    for (let i = 0; i < ast.length(); i += 2) {
      newHash.push(EVAL(ast.ast[i], env));
      newHash.push(EVAL(ast.ast[i + 1], env));
    }
    return new HashMap(newHash);
  }

  return ast;
};

const EVAL = (ast, env) => {
  if (!(ast instanceof List)) return eval_ast(ast, env);

  if (ast.ast[0].equals('def!')) {
    const value = EVAL(ast.ast[2], env);
    env.set(ast.ast[1], value);
    return value;
  }

  if (ast.isEmpty()) return ast;

  const newList = ast.ast.map((as) => eval_ast(as, env));
  return newList[0].apply(null, newList.slice(1));
};

const replEnv = new Env();
replEnv.set('+', (a, b) => a + b);
replEnv.set('-', (a, b) => a - b);
replEnv.set('*', (a, b) => a * b);
replEnv.set('/', (a, b) => a / b);
replEnv.set('pi', Math.PI);

const rep = (str) => pr_str(EVAL(read_form(str), replEnv));

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
