import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { ContactRoute } from "./routes/contact";
import { API } from "./constants/api";
import { errorHandler } from "./middlewares/error-handler";
import * as swaggerDocument from "../swagger.json";


const app = express();

app.use(express.json());
app.use(cors());
app.use(`${API.BASE_URL}${API.CONTACT}`, ContactRoute);
app.use(
  `${API.BASE_URL}${API.SWAGGER}`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(errorHandler);

export {app};