class Cache {
  constructor() {
    this.cache = new Map();
    this.timeToLive = 10 * 60 * 1000;
  }

  set(key, value, timeToLive = this.timeToLive) {
    const expiry = Date.now() + timeToLive;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) {
      return null;
    }

    if (Date.now() > cachedItem.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  addUser(user) {
    if (!user || !user.emailAddress) {
      throw new Error("User must have an email address");
    }

    const users = this.get("users") || [];

    const existingUserIndex = users.findIndex(
      (u) => u.emailAddress === user.emailAddress,
    );

    if (existingUserIndex !== -1) {
      return users[existingUserIndex];
    } else {
      users.push(user);
    }

    this.set("users", users);
    return null;
  }
}

let instance;

function getCacheInstance() {
  if (!instance) {
    instance = new Cache();
  }
  return instance;
}

module.exports = { getCacheInstance };
