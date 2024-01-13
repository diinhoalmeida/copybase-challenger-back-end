import { Request, Response } from "express";
import * as path from "path";
import {
  convertToSemanticName,
  groupByMonthYearAndStatus,
} from "../../../utils/elementConverter";
import * as reader from "xlsx";
import {
  countSubscribersByStatus,
  stackedBarChartFrequency,
} from "../../../utils/dataModifier";

export class GetFileDataController {
  async handle(request: Request, response: Response) {
    const fileName = "modelo-teste-full-stack";
    let data: any[] = [];

    try {
      const filePath = path.join(
        __dirname,
        "../../../uploads",
        fileName + ".xlsx"
      );
      const file = reader.readFile(filePath);
      const sheetNames = file.SheetNames;

      for (let i = 0; i < sheetNames.length; i++) {
        const arr = reader.utils.sheet_to_json(file.Sheets[sheetNames[i]]);

        arr.forEach((element: any) => {
          const convertedElement: { [key: string]: any } = {};

          Object.entries(element).forEach(([key, value]) => {
            if (typeof key === "string") {
              convertedElement[convertToSemanticName(key)] = value;
            }
          });

          data.push(convertedElement);
        });
      }

      const statusCounts = countSubscribersByStatus(data);
      const statusByMonths = groupByMonthYearAndStatus(data);

      return response.json({
        success: true,
        message: "Dados processados",
        statusCode: 200,
        data: {
          statusCounts,
          data,
          statusByMonths,
        },
      });
    } catch (err) {
      return { success: false, error: "Erro no servidor.", statusCode: 500 };
    }
  }
}
