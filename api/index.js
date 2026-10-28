/**
 * api/index.js
 * Vercel Serverless Function entry point.
 *
 * Routes incoming HTTP requests to the Express application in ./server/server.js.
 */

const app = require("../server/server");

module.exports = app;
