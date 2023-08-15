"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// TODO: get requests for companies everyone - creating, updating, and deleting companies should only be possible by is_admin flag 

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  console.log("req.header:", req.headers)
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }

    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  // console.log("req.body", req.body)
  // console.log("res.locals:", res.locals)
  // console.log("res.locals.user.isAdmin:", res.locals.user.isAdmin)
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must be logged in AND an admin.
 * 
 * If not, raises Unauthorized. 
 */

function ensureAdmin(req, res, next) {
  try {
    if (res.locals.user.isAdmin === false) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must the user that is logged in OR an admin.
 * 
 * If not, raises Unauthorized 
 */

function ensureUsersAccountOrAdmin(req, res, next) {
  try {
    let userLoggedIn = res.locals.user.username;
    if (res.locals.user.isAdmin === false && userLoggedIn !== req.params.username) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}



module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin, 
  ensureUsersAccountOrAdmin
};


