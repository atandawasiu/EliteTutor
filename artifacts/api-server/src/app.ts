import express, { type Express } from "express";
import cors from "cors";
import * as pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    maxAge: "7d",
    immutable: false,
  }),
);

app.use("/api", router);

export default app;
