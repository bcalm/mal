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

  length() {
    return this.ast.length;
  }

  equals(anotherList) {
    if (!(anotherList instanceof List)) return false;
    if (this.ast.length !== anotherList.ast.length) return false;

    return this.ast.every(
      (element, index) => element === anotherList.ast[index]
    );
  }
}

class Vector {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return '[' + this.ast.map((ast) => ast.toString()).join(' ') + ']';
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  length() {
    return this.ast.length;
  }

  equals(anotherVector) {
    if (!(anotherVector instanceof Vector)) return false;
    if (this.ast.length !== anotherVector.ast.length) return false;

    return this.ast.every(
      (element, index) => element === anotherVector.ast[index]
    );
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

  isEmpty() {
    return this.hashmap.size === 0;
  }

  length() {
    return this.ast.size;
  }
}

class Nil {
  toString() {
    return 'nil';
  }

  equals(anotherInput) {
    return anotherInput instanceof Nil;
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

  equals(anotherString) {
    if (!(anotherString instanceof String)) return false;
    return this.ast === anotherString.ast;
  }
}

class KeyWord {
  constructor(ast) {
    this.ast = ast;
  }

  toString() {
    return ':' + this.ast;
  }

  equals(anotherKeyword) {
    if (!(anotherKeyword instanceof KeyWord)) return false;
    return this.ast === anotherKeyword.ast;
  }
}

class Fn {
  constructor(fn) {
    this.fn = fn;
  }

  toString() {
    return '#<function>';
  }
}

module.exports = { List, Vector, Nil, Symbol, Str, HashMap, KeyWord, Fn };
