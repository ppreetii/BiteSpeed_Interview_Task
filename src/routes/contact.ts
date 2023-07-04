import express from "express";

import {identifyContact} from "../controllers/contact";
import { API } from "../constants/api";

const router = express.Router();

router.post(`${API.IDENTIFY}`, identifyContact);

export {router as ContactRoute};