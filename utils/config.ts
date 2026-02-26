
import * as dotenv from "dotenv";
dotenv.config();

export const BASE_URL = process.env.BASE_URL || "http://localhost:5500";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD || "password";
