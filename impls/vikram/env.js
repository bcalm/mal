const { List } = require('./types');

class Env {
  constructor(outer, binds = [], exprs = []) {
    this.data = {};
    this.outer = outer;
    for (let index = 0; index < binds.length; index++) {
      const symbol = binds[index];
      if (symbol.symbol === '&') {
        this.data[binds[index + 1].symbol] = new List(exprs.slice(index));
        break;
      } else this.set(symbol, exprs[index]);
    }
  }

  set(key, value) {
    return (this.data[key.symbol] = value);
  }

  find(key) {
    if (key in this.data) return this;
    if (!this.outer) return null;
    return this.outer.find(key);
  }

  get(key) {
    const symbol = key.symbol;
    const env = this.find(symbol);
    if (!env) {
      throw new Error(`'${symbol}' not found`);
    }
    return env.data[symbol];
  }
}

module.exports = { Env };
