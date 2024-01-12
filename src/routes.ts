import { Router } from "express";
import { UploadFileController } from "./modules/files/UploadFileController";
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

////FILE
routes.post(
  "/sessions",
  upload.array("files"),
  uploadFileControllerController.handle
);

export { routes };
