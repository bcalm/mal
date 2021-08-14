class List {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '(' + this.ast.map((ast) => ast.toString()).join(' ') + ')';
  }

  isEmpty() {
    return this.ast.length === 0;
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

  length() {
    return this.ast.length / 2;
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

class KeyWord {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return ':' + this.ast;
  }
}

module.exports = { List, Vector, Nil, Symbol, Str, HashMap, KeyWord };
