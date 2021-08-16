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
    const hashmap = new Map();
    for (let i = 0; i < ast.length; i += 2) {
      hashmap.set(ast[i], ast[i + 1]);
    }
    this.hashmap = hashmap;
  }

  toString() {
    let result = '';
    let separator = '';
    for (let [k, v] of this.hashmap.entries()) {
      result += separator;
      separator = ' ';
      result += k;
      result += separator;
      result += v;
    }
    return `{${result}}`;
  }
}

class Nil {
  toString() {
    return 'nil';
  }
}

class Symbol {
  constructor(ast) {
    this.symbol = ast;
  }

  toString() {
    return this.symbol.toString();
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
