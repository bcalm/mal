const readline = require('readline');
const core = require('./core');
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
  while (true) {
    if (!(ast instanceof List)) {
      return eval_ast(ast, env);
    }
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
        env = newEnv;
        ast = ast.ast[2];
        break;
      case 'if':
        const exprsResult = EVAL(ast.ast[1], env);
        if (exprsResult instanceof Nil || exprsResult === false) {
          ast = ast.ast[3] === undefined ? new Nil() : ast.ast[3];
        } else {
          ast = ast.ast[2];
        }
        break;

      case 'do':
        ast.ast.slice(1, -1).forEach((exprs) => {
          EVAL(exprs, env);
        });
        ast = ast.ast[ast.ast.length - 1];
        break;

      case 'fn*':
        const binds = ast.ast[1].ast;
        const fnBody = ast.ast[2];
        return new Fn(fnBody, binds, env);

      default:
        const newList = eval_ast(ast, env);
        const fnToApply = newList.ast[0];
        if (fnToApply instanceof Fn) {
          ast = fnToApply.fnBody;
          env = new Env(fnToApply.env, fnToApply.binds, newList.ast.slice(1));
        } else if (fnToApply instanceof Function) {
          return fnToApply.apply(null, newList.ast.slice(1));
        } else {
          return fnToApply;
        }
    }
  }
};

const loadSym = (env, sym, val) => env.set(new Symbol(sym), val);

const replEnv = new Env(null);
Object.entries(core).forEach(([sym, val]) => loadSym(replEnv, sym, val));

const rep = (str) => pr_str(EVAL(read_form(str), replEnv));
const eval = (ast) => EVAL(ast, replEnv);
loadSym(replEnv, 'eval', eval);

rep('(def! not (fn* (a) (if a false true)))');
rep(
  '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
);
rep(
  `(def! swap!
      (fn* [at func & args]
        (reset! at
          (eval
            (concat (list func (deref at)) args)))))`
);

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
