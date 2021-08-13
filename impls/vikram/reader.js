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

const read_form = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  const token = reader.peek();
  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }
  if (token.match(/^-?[0-9][0-9.]*$/)) {
    return parseFloat(token);
  }
  return token;
};

module.exports = read_form;
