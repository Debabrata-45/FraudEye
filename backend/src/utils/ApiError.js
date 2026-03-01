class ApiError extends Error {
  constructor(statusCode, message, code = "ERR_GENERIC") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
module.exports = { ApiError };