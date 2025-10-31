import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {uploadMedia} from "../controllers/user.conrollers.js"

const router = Router();
router.route("/uploadMedia").post(upload.single("media"),uploadMedia)

export default router;