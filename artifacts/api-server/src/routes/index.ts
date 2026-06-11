import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wolframRouter from "./wolfram";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wolframRouter);
router.use(uploadRouter);

export default router;
