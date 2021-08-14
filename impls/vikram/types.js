class List {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '(' + this.ast.map((ast) => ast.toString()).join(' ') + ')';
  }
}

class Vector {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '[' + this.ast.map((ast) => ast.toString()).join(' ') + ']';
  }
}

class HashMap {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '{' + this.ast.map((ast) => ast.toString()).join(' ') + '}';
  }
}

class Nil {
  toString() {
    return 'nil';
  }
}

class Symbol {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return this.ast.toString();
  }
}

class Str {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '"' + this.ast + '"';
  }
}

module.exports = { List, Vector, Nil, Symbol, Str, HashMap };
