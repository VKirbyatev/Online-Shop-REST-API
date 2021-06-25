class NetworkError extends Error {
  code = 500;

  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export { NetworkError };
