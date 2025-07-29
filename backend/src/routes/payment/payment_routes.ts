import { Router } from "express";
import { payment, sessionStatus } from "./payment_controller";

const router = Router();

router.post("/create-checkout-session", payment);

router.get("/session-status", sessionStatus);

export default router;
