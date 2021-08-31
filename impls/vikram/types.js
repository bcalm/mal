class MalVal {
  constructor() {}

  prn_str(print_readably = false) {
    return 'default MalVal';
  }
}

const mkString = (element, open, close) => {
  return `${open}${element}${close}`;
};

const prStr = (value, print_readably = false) => {
  if (value instanceof MalVal) {
    return value.prn_str(print_readably);
  }
  return value.toString();
};

class List extends MalVal {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  prn_str(print_readably = false) {
    const element = this.ast.map((ast) => prStr(ast, print_readably)).join(' ');
    return mkString(element, '(', ')');
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

class Vector extends MalVal {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  prn_str(print_readably = false) {
    const element = this.ast.map((ast) => prStr(ast, print_readably)).join(' ');
    return mkString(element, '[', ']');
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

class HashMap extends MalVal {
  constructor(ast) {
    super();
    const hashmap = new Map();
    for (let i = 0; i < ast.length; i += 2) {
      hashmap.set(ast[i], ast[i + 1]);
    }
    this.hashmap = hashmap;
  }

  prn_str(print_readably = false) {
    let result = '';
    let separator = '';
    for (let [k, v] of this.hashmap.entries()) {
      result += separator;
      separator = ' ';
      result += prStr(k, print_readably);
      result += separator;
      result += prStr(v, print_readably);
    }
    console.log(result);
    return mkString(result, '{', '}');
  }

  isEmpty() {
    return this.hashmap.size === 0;
  }

  length() {
    return this.ast.size;
  }
}

class Nil extends MalVal {
  prn_str() {
    return 'nil';
  }

  equals(anotherInput) {
    return anotherInput instanceof Nil;
  }
}

class Symbol extends MalVal {
  constructor(ast) {
    super();
    this.symbol = ast;
  }

  prn_str(print_readably = false) {
    return this.symbol.toString();
  }
}

class Str extends MalVal {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  equals(anotherString) {
    if (!(anotherString instanceof String)) return false;
    return this.ast === anotherString.ast;
  }

  prn_str(print_readably = false) {
    console.log(print_readably);
    if (print_readably) {
      return (
        '"' +
        this.ast
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n') +
        '"'
      );
    }
    return '"' + this.ast + '"';
  }
}

class KeyWord extends MalVal {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  prn_str(print_readably = false) {
    return ':' + this.ast;
  }

  equals(anotherKeyword) {
    if (!(anotherKeyword instanceof KeyWord)) return false;
    return this.ast === anotherKeyword.ast;
  }
}

class Fn extends MalVal {
  constructor(fnBody, binds, env, fn) {
    super();
    this.fnBody = fnBody;
    this.binds = binds;
    this.env = env;
    this.fn = fn;
  }

  prn_str(print_readably = false) {
    return '#<function>';
  }
}

class Atom extends MalVal {
  constructor(value) {
    super();
    this.value = value;
  }

  prn_str(print_readably = false) {
    return `(atom ${this.value})`;
  }

  equals(that) {
    return equals(this.value, that.value);
  }

  set(value) {
    this.value = value;
    return this.value;
  }

  get() {
    return this.value;
  }
}

module.exports = {
  List,
  Vector,
  Nil,
  Symbol,
  Str,
  HashMap,
  KeyWord,
  Fn,
  Atom,
  MalVal,
  prStr,
};
