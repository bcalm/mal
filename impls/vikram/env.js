class Env {
  constructor(outer) {
    this.data = {};
    this.outer = outer;
  }

  set(key, value) {
    return (this.data[key.symbol] = value);
  }

  find(key) {
    const value = this.data[key];
    if (value) return this;
    if (!this.outer) return null;
    return this.outer.find(key);
  }

  get(key) {
    const env = this.find(key);
    if (!env) {
      throw new Error(`'${key}' not found`);
    }
    const value = env.data[key.symbol];
    if (value) return value;
  }
}

module.exports = { Env };
