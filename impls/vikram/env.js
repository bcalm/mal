class Env {
  constructor(outer, binds = [], exprs = []) {
    this.data = {};
    this.outer = outer;

    binds.forEach((symbol, index) => {
      this.set(symbol, exprs[index]);
    });
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
    const value = env.data[symbol];
    if (value) return value;
  }
}

module.exports = { Env };
