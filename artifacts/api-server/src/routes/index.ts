import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wolframRouter from "./wolfram";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wolframRouter);

export default router;
