import Redis from 'ioredis';

export default class RedisStore {
  constructor(config) {
    this.redis = new Redis(config);
  }
  async get(key) {
    const data = await this.redis.get(`SESSION:${key}`);
    return data && JSON.parse(data);
  }

  async set(key, value, maxAge = 364000) {
    console.log("maxage: >", maxAge, key);
    console.dir(value, { depth: Infinity });
    await this.redis.set(`SESSION:${key}`, JSON.stringify(value), 'EX', maxAge / 1000);
  }

  async destroy(key) {
    return await this.redis.del(`SESSION:${key}`)
  }
}