/**
 * Async Middleware
 * 
 * This middleware wraps async route handlers in a try/catch block
 * to avoid using try/catch blocks in each controller method.
 * 
 * @param {Function} fn - The async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
