export interface ResponseI {
  success: false | true;
  error?: string;
  message?: string;
  statusCode: number;
}
