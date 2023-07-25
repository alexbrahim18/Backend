import twilio from "twilio";
import { Router } from "express";
import passport from "passport";
import { passportAuthenticateApi } from "../utils.js";
import UserDto from "../dto/user.dto.js";
import config from "../config/config.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const client = twilio(config.TWILIO_SID, config.TWILIO_AT);
        console.log(config.TWILIO_SID, config.TWILIO_AT, config.TWILIO_PH);
        const result = await client.messages.create({
            body: "PRUEBA",
            from: config.TWILIO_PH,
            to: "+ 54 3816304495",
        });
        res.send(result);
    } catch (error) {
        res.status(400).send(error)
    }
});

export default router;