import ApplicationError from './applicationError';

class BadRequestError extends ApplicationError {
  constructor(message) {
    super(message, 400);
  }
}

export default BadRequestError;