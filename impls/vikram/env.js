class Env {
  constructor() {
    this.data = {};
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    const value = this.data[key];
    if (value) return value;
    throw new Error('Symbol not found');
  }
}

module.exports = { Env };
