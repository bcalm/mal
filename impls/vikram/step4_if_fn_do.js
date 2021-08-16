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
  if (ast instanceof Symbol) {
    return env.get(ast);
  }

  if (ast instanceof List) {
    const evaluatedList = ast.ast.map((v) => EVAL(v, env));
    return new List(evaluatedList);
  }

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
        return secondParam === undefined ? new Nil() : EVAL(ast.ast[3], env);
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
      const fnBody = ast.ast.slice(2);
      const fn = function (...args) {
        let evaluatedArgs = args.map((x) => EVAL(x, env));
        const fn_env = new Env(env, binds, evaluatedArgs);
        let result = new Nil();
        for (let i = 2; i < ast.ast.length; i++) {
          result = EVAL(ast.ast[i], fn_env);
        }
        return result;
      };
      return new Fn(fn);
    default:
      const newList = eval_ast(ast, env);
      const fnToApply = newList.ast[0];
      if (fnToApply instanceof Fn)
        return fnToApply.fn.apply(null, newList.ast.slice(1));
      return newList;
  }
};

const replEnv = new Env(coreEnv);

const rep = (str) => pr_str(EVAL(read_form(str), replEnv));

rep('(def! not (fn* (a) (if a false true)))');

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
