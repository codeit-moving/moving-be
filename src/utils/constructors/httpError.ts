import CustomError from "../interfaces/customError";

export class HttpError implements CustomError {
  status?: number;
  data?: { [key: string]: string | boolean };
  name: string;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.data = { message };
    this.name = this.getErrorName(status);
    this.message = message;
  }

  private getErrorName(status: number): string {
    switch (status) {
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 409:
        return "Conflict";
      case 422:
        return "Unprocessable Entity";
      default:
        return "Internal Server Error";
    }
  }
}

export const throwHttpError = (status: number, message: string) => {
  const error = new HttpError(status, message);
  throw error;
};
