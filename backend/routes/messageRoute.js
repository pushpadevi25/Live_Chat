import express from "express";
import { getMessage, sendMessage, deleteMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated, upload.single('file'), sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/:messageId").delete(isAuthenticated, deleteMessage);

export default router;