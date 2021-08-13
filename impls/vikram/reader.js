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
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }
  if (token.match(/^-?[0-9][0-9.]*$/)) {
    return parseFloat(token);
  }
  return token;
};

const read_list = (reader) => {
  const ast = [];
  while ((token = reader.peek()) !== ')') {
    if (token === undefined) {
      throw new Error('unbalanced');
    }
    const result = read_form(reader);
    ast.push(result);
  }
  reader.next();
  return ast;
};

const read_form = (reader) => {
  const token = reader.peek();
  switch (token) {
    case '(':
      reader.next();
      return read_list(reader);
  }
  reader.next();
  return read_atom(token);
};

const read_ast = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = read_ast;
