import e, { Router } from "express";
import { handleStripeWebhook } from "../payment/payment_controller";
import bodyParser from "body-parser";

const router = Router();

router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
