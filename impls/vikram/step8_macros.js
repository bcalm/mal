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

const quasiquoteList = (ast) => {
  let result = new List([]);

  for (let index = ast.ast.length - 1; index >= 0; index--) {
    const elt = ast.ast[index];
    if (elt instanceof List && elt.beginsWith('splice-unquote')) {
      result = new List([new Symbol('concat'), elt.ast[1], result]);
    } else {
      result = new List([new Symbol('cons'), quasiquote(elt), result]);
    }
  }
  return result;
};

const quasiquote = (ast) => {
  if (ast instanceof List && ast.beginsWith('unquote')) {
    return ast.ast[1];
  }

  if (ast instanceof List) {
    return quasiquoteList(ast);
  }

  if (ast instanceof Vector) {
    return new List([new Symbol('vec'), quasiquoteList(ast)]);
  }

  if (ast instanceof HashMap || ast instanceof Symbol) {
    return new List([new Symbol('quote'), ast]);
  }

  return ast;
};

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

const is_macro_call = (ast, env) => {
  if (!(ast instanceof List)) return false;
  const elt = ast.ast[0];

  return (
    elt instanceof Symbol &&
    env.find(elt.symbol) &&
    env.get(elt) instanceof Fn &&
    env.get(elt).is_macro
  );
};

const macroexpand = (ast, env) => {
  while (is_macro_call(ast, env)) {
    const macro = env.get(ast.ast[0]);
    ast = macro.apply(ast.ast.slice(1));
  }
  return ast;
};

const createFunction = (ast, binds, env) => {
  return function (...args) {
    const fn_env = new Env(env, binds, args);
    return EVAL(ast.ast[2], fn_env);
  };
};

const EVAL = (ast, env, isMacro = false) => {
  while (true) {
    ast = macroexpand(ast, env);
    if (!(ast instanceof List)) {
      return eval_ast(ast, env);
    }
    if (ast.isEmpty()) return ast;

    const [elt1, elt2, elt3, elt4] = ast.ast;

    switch (elt1.symbol) {
      case 'def!':
        return env.set(elt2, EVAL(elt3, env));

      case 'let*':
        const newEnv = new Env(env);
        const bindings = elt2.ast;
        for (let i = 0; i < bindings.length; i += 2) {
          newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
        }
        env = newEnv;
        ast = elt3;
        break;
      case 'if':
        const exprsResult = EVAL(ast.ast[1], env);
        if (exprsResult instanceof Nil || exprsResult === false) {
          ast = elt4 === undefined ? new Nil() : elt4;
        } else {
          ast = elt3;
        }
        break;

      case 'do':
        ast.ast.slice(1, -1).forEach((exprs) => {
          EVAL(exprs, env);
        });
        ast = ast.ast[ast.ast.length - 1];
        break;

      case 'fn*':
        const binds = elt2.ast;
        const fnBody = elt3;
        const fn = createFunction(ast, binds, env);
        return new Fn(fnBody, binds, env, fn, isMacro);

      case 'quote':
        return elt2;

      case 'quasiquoteexpand':
        return quasiquote(elt2);

      case 'quasiquote':
        ast = quasiquote(elt2);
        break;

      case 'defmacro!':
        return env.set(elt2, EVAL(elt3, env, true));

      case 'macroexpand':
        return macroexpand(elt2, env);

      default:
        const newList = eval_ast(ast, env);
        const fnToApply = newList.ast[0];
        if (fnToApply instanceof Fn) {
          ast = fnToApply.fnBody;
          env = new Env(fnToApply.env, fnToApply.binds, newList.ast.slice(1));
        } else if (fnToApply instanceof Function) {
          return fnToApply.apply(null, newList.ast.slice(1));
        } else {
          return newList;
        }
    }
  }
};

const loadSym = (env, sym, val) => env.set(new Symbol(sym), val);

const replEnv = new Env(null);
Object.entries(core).forEach(([sym, val]) => loadSym(replEnv, sym, val));

const rep = (str) => pr_str(EVAL(read_form(str), replEnv), true);
const eval = (ast) => EVAL(ast, replEnv);
loadSym(replEnv, 'eval', eval);

rep('(def! not (fn* (a) (if a false true)))');

rep(
  '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
);

rep(
  '(defmacro! cond (fn* (& xs) (if (> (count xs) 0) (list \'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw "odd number of forms to cond")) (cons \'cond (rest (rest xs)))))))'
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
