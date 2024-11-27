import regionService from "../services/regionService";
import { asyncHandle } from "../utils/asyncHandler";
import express from "express";

const router = express.Router();

router.get(
  "/all",
  asyncHandle(async (req, res, next) => {
    const services = await regionService.getRegionsAll();
    return res.status(200).send(services);
  })
);
