const Redis = require('ioredis')

// Don't bother trying to connect to Redis if a host and port were not configured
let client = {}
if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  client = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    db: process.env.REDIS_DB !== undefined ? process.env.REDIS_DB : 0
  })
}

/**
 * Thin wrapper around the `ioredis` API so that we're not too tightly coupled to it, in case we need to swap
 * it out for a different library in the future.
 * This module either currently or in the future will contain "composite" commands as appropriate, which are convenience commands
 * built by combining together individual Redis out-of-the-box commands to carry any operation needed for the business domain.
 * The ioredis command library is a 1 to 1 mapping
 * to the Redis commands. For a full list of Redis commands visit https://redis.io/commands/.
 */
module.exports = client
