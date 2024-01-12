import { GetFileDataController } from "./modules/files/getFileData/GetFileDataController";
import { Router } from "express";
import { UploadFileController } from "./modules/files/uploadFile/UploadFileController";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const routes = Router();

//FILE
const uploadFileControllerController = new UploadFileController();
const getFileDataController = new GetFileDataController();

////FILE
routes.post(
  "/sessions",
  upload.array("files"),
  uploadFileControllerController.handle
);
routes.get("/getfiledata", getFileDataController.handle);

export { routes };
