import { FRONTEND_URL } from "../../env";
import CustomError from "../interfaces/customError";

export class redirectError implements CustomError {
  status?: number;
  data?: { [key: string]: string | boolean };
  name: string;
  message: string;

  constructor(message: string, path: string) {
    this.status = 302;
    this.message = message;
    this.name = "Found";
    this.data = {
      message,
      redirectUrl: FRONTEND_URL + path,
      redirect: true,
    };
  }
}

export const throwRedirectError = (message: string, path: string) => {
  const error = new redirectError(message, path);
  throw error;
};
