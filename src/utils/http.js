
export class HttpError extends Error {
  constructor(status, message, cause) {
    super(message);
    this.status = status;
    this.cause = cause;
  }
}

/**
 * Encodes username and password to a HTTP Basic Authorization header avlue
 * @param  {string} username
 * @param  {string} password
 * @return {string} HTTP Basic encoded string
 */
export function encodeBasic(username, password) {
  return 'Basic ' + btoa(username + ':' + password);
}
