import { ResponseI } from "interfaces/responses";

interface UploadFileUseCaseProps {
  files: any;
}

type UploadFileUseCaseResult = ResponseI;

export class UploadFileUseCaseUseCase {
  async execute({
    files,
  }: UploadFileUseCaseProps): Promise<UploadFileUseCaseResult> {
    try {
      if (!files) {
        return {
          success: false,
          error: "Nenhum arquivo enviado.",
          statusCode: 400,
        };
      }

      return {
        success: true,
        message: "Arquivo recebido com sucesso.",
        statusCode: 200,
      };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Erro no servidor.", statusCode: 500 };
    }
  }
}
