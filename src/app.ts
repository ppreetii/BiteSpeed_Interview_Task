import express from "express";
import cors from "cors";

import { ContactRoute } from "./routes/contact";
import { API } from "./constants/api";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(express.json());
app.use(cors());
app.use(`${API.BASE_URL}${API.CONTACT}`, ContactRoute);

app.use(errorHandler);

export {app};