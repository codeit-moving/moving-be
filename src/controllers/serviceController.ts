import serviceService from "../services/serviceService";
import { asyncHandle } from "../utils/asyncHandler";
import express from "express";

const router = express.Router();

router.get(
  "/all",
  asyncHandle(async (req, res, next) => {
    const services = await serviceService.getServicesAll();
    return res.status(200).send(services);
  })
);

export default router;
