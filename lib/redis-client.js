const Redis = require('ioredis')

// Don't bother trying to connect to Redis if a host and port were not configured
const functions = {}
if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
  const client = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    db: process.env.REDIS_DB !== undefined ? process.env.REDIS_DB : 0
  })

  // We want to export the ioredis functions as-is, but can't do E.g. `client.hget` inside the exported JSON literal because
  // it violates JSON syntax, hence assign to intermediary variables and then deference those in the JSON literal farther below
  for (const member in client) {
    if (client[member] instanceof Function) {
      functions[member] = client[member].bind(client)
    }
  }
}

/**
 * Thin wrapper around the `ioredis` API so that we're not too tightly coupled to it, in case we need to swap
 * it out for a different library in the future.
 * This module either currently or in the future will contain "composite" commands as appropriate, which are convenience commands
 * built by combining together individual Redis out-of-the-box commands to carry any operation needed for the business domain.
 * The ioredis command library is a 1 to 1 mapping
 * to the Redis commands. For a full list of Redis commands visit https://redis.io/commands/. Feel free to add missing commands
 * as needed, <strong>provided that you promisify all command additions!</strong>
 * All these functions return a Promise
 */
module.exports = functions
