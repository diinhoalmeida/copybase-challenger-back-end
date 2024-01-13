import { Request, Response } from "express";
import { UploadFileUseCaseUseCase } from "./UploadFileUseCase";

export class UploadFileController {
  async handle(request: Request, response: Response) {
    const { files } = request;

    const authenticateUserUseCase = new UploadFileUseCaseUseCase();
    const result = await authenticateUserUseCase.execute({
      files,
    });
    if (result.success) {
      return response.json(result);
    } else {
      return response.status(result.statusCode).json({ error: result.error });
    }
  }
}
