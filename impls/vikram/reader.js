const { List, Vector, Nil, Symbol, Str, HashMap, KeyWord } = require('./types');

const tokenize = (str) => {
  const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  const results = [];
  while ((match = re.exec(str)[1]) != '') {
    if (match[0] !== ';') results.push(match);
  }
  return results;
};

class Reader {
  constructor(tokens) {
    this.tokens = tokens.slice();
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const currentToken = this.tokens[this.position];
    if (currentToken) {
      this.position++;
    }
    return currentToken;
  }
}

const read_atom = (token) => {
  if (token.match(/^\-?[0-9]+$/)) return parseInt(token);
  if (token.match(/^\-?[0-9]+\.?[0-9]+$/)) return parseFloat(token);
  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token === 'nil') return new Nil();
  if (token.startsWith(':')) return new KeyWord(token.slice(1));
  if (token.startsWith('"')) {
    if (/[^\\]"$/.test(token)) {
      return new Str(token.slice(1, token.length - 1));
    }
    throw new Error('unbalanced');
  }
  return new Symbol(token);
};

const read_seq = (reader, ending) => {
  let token = reader.peek();
  const ast = [];
  while (token !== ending) {
    if (token === undefined) throw new Error('unbalanced');
    ast.push(read_form(reader));
    token = reader.peek();
  }
  reader.next();
  return ast;
};

const read_list = (reader) => {
  const ast = read_seq(reader, ')');
  return new List(ast);
};

const read_vector = (reader) => {
  const ast = read_seq(reader, ']');
  return new Vector(ast);
};

const read_hashmap = (reader) => {
  const ast = read_seq(reader, '}');
  if (ast.length % 2) {
    throw new Error('map is unbalanced');
  }
  return new HashMap(ast);
};

const read_form = (reader) => {
  const token = reader.peek();
  reader.next();
  switch (token) {
    case '(':
      return read_list(reader);
    case ')':
      throw new Error('unexpected');
    case '[':
      return read_vector(reader);
    case ']':
      throw new Error('unexpected');
    case '{':
      return read_hashmap(reader);
    case '}':
      throw new Error('unexpected');
  }
  return read_atom(token);
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = read_str;
