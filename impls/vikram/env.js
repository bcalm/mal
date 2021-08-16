class Env {
  constructor(outer) {
    this.data = {};
    this.outer = outer;
  }

  set(key, value) {
    this.data[key.symbol] = value;
  }

  find(key) {
    const value = this.data[key];
    if (value) return this;
    if (!this.outer) return null;
    return this.outer.find(key);
  }

  get(key) {
    const env = this.find(key);
    const value = env.data[key.symbol];
    if (value) return value;
    throw new Error('Symbol not found');
  }
}

module.exports = { Env };
