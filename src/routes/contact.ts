import express from "express";

import {identifyContact} from "../controllers/contact"

const router = express.Router();

router.post("/identify", identifyContact);

export {router as ContactRoute};