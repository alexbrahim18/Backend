import dotenv from "dotenv";

dotenv.config();

export default {
    MONGO_URL:
        "mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PASS +
        "@cluster0.zzswcza.mongodb.net/ecommerce",
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_COOKIE: process.env.JWT_COOKIE,
    ADMIN_EMAIL: process.env.ADMIN_MAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASS, 
};