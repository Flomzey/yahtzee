import express from "express";
import gameApi from "./game.js";
import statsApi from "./stats.js";

const router = express.Router();

router.use("/game", gameApi);

router.use("/stats", statsApi);

export default router;