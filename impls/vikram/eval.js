const { List, Symbol, Vector, HashMap } = require('./types');

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
    for (let i = 0; i < ast.length(); i += 2) {
      newHash.push(EVAL(ast.ast[i], env));
      newHash.push(EVAL(ast.ast[i + 1], env));
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

module.exports = { EVAL };
