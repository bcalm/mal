class MalVal {
  constructor() {}

  prn_str(print_readably = false) {
    return 'default MalVal';
  }
}

const equals = (val1, val2) => {
  if (val1 instanceof MalVal) {
    return val1.equals(val2);
  }
  return val1 === val2;
};

class MalSeq extends MalVal {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  equals(that) {
    if (!(that instanceof MalSeq)) return false;

    if (this.ast.length !== that.ast.length) return false;

    return this.ast.every((element, index) =>
      equals(element, anotherList.ast[index])
    );
  }

  isEmpty() {
    return this.ast.length === 0;
  }

  count() {
    return this.ast.length;
  }

  beginsWith(value) {
    return this.ast[0] && this.ast[0].symbol === value;
  }

  cons(value) {
    return new List([value, ...this.ast]);
  }

  concat(that) {
    return new List([...this.ast, ...that.ast]);
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

class List extends MalSeq {
  constructor(ast) {
    super(ast);
    this.ast = this.ast;
  }

  prn_str(print_readably = false) {
    const element = this.ast.map((ast) => prStr(ast, print_readably)).join(' ');
    return mkString(element, '(', ')');
  }
}

class Vector extends MalSeq {
  constructor(ast) {
    super(ast);
    this.ast = ast;
  }

  prn_str(print_readably = false) {
    const element = this.ast.map((ast) => prStr(ast, print_readably)).join(' ');
    return mkString(element, '[', ']');
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
    return mkString(result, '{', '}');
  }

  isEmpty() {
    return this.hashmap.size === 0;
  }

  length() {
    return this.ast.size;
  }

  equals(that) {
    if (!(that instanceof HashMap)) {
      return false;
    }

    const otherEntries = that.entries();

    return this.entries().every(([key, val], ind) => {
      const [thatKey, thatVal] = otherEntries[ind];
      return equals(key, thatKey) && equals(val, thatVal);
    });
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
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }

  prn_str(print_readably = false) {
    return this.symbol.toString();
  }

  equals(that) {
    return that instanceof Symbol && this.symbol === that.symbol;
  }
}

class Str extends MalVal {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  equals(anotherString) {
    if (!(anotherString instanceof Str)) return false;
    return this.ast === anotherString.ast;
  }

  prn_str(print_readably = false) {
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
  constructor(fnBody, binds, env, fn, is_macro = false) {
    super();
    this.fnBody = fnBody;
    this.binds = binds;
    this.env = env;
    this.fn = fn;
    this.is_macro = is_macro;
  }

  prn_str(print_readably = false) {
    return '#<function>';
  }

  equals(that) {
    return this === that;
  }

  apply(args) {
    return this.fn.apply(null, args);
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
  MalSeq,
  prStr,
  equals,
};
