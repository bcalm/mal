const readline = require('readline');
const { coreEnv } = require('./core');
const env = require('./env');
const { Env } = require('./env');
const pr_str = require('./printer');
const read_form = require('./reader');
const { List, Symbol, Vector, HashMap, Nil, Fn } = require('./types');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast instanceof Symbol) return env.get(ast);

  if (ast instanceof List) return EVAL(ast, env);

  if (ast instanceof Vector)
    return new Vector(ast.ast.map((as) => eval_ast(as, env)));

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
  if (!(ast instanceof List)) return eval_ast(ast, env);
  if (ast.isEmpty()) return ast;
  switch (ast.ast[0].symbol) {
    case 'def!':
      return env.set(ast.ast[1], EVAL(ast.ast[2], env));

    case 'let*':
      const newEnv = new Env(env);
      const bindings = ast.ast[1].ast;
      for (let i = 0; i < bindings.length; i += 2) {
        newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
      }
      return EVAL(ast.ast[2], newEnv);

    case 'if':
      const exprsResult = EVAL(ast.ast[1], env);
      if (exprsResult instanceof Nil || exprsResult === false) {
        const secondParam = ast.ast[3];
        return secondParam ? EVAL(ast.ast[3], env) : new Nil();
      }
      return EVAL(ast.ast[2], env);

    case 'do':
      let result = new Nil();
      ast.ast.slice(1).forEach((exprs) => {
        result = EVAL(exprs, env);
      });
      return result;

    case 'fn*':
      const binds = ast.ast[1].ast;
      const fnBody = ast.ast[2];
      const fn = (...fnArgs) => {
        const newEnv = new Env(env, binds, fnArgs);
        return EVAL(fnBody, newEnv);
      };
      return new Fn(fn);
    default:
      const newList = ast.ast.map((as) => eval_ast(as, env));
      const fnToApply = newList[0];
      return fnToApply.fn.apply(null, newList.slice(1));
  }
};

const replEnv = new Env(coreEnv);

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
