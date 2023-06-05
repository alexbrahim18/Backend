import { Router } from "express";
import userManagerDB from "../dao/MongoDB/userManager.js";

const router = Router();
const user = new userManagerDB();

router.get("/", (req, res) => {
    console.log(req.session)
    res.render("register", {});
});
router.get("/register", (req, res) => {
    res.render("register", {});
});
router.post("/", async (req, res) => {
    const newuser = req.body;
    console.log(newuser);
    try {
        const result = await user.newUser(newuser);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.redirect("login");
        }
    } catch (err) {
        res.status(400).send(err);
    }
});
router.post("/register", async (req, res) => {
    const newuser = req.body;
    console.log(newuser);
    try {
        const result = await user.newUser(newuser);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.redirect("login");
        }
    } catch (err) {
        res.status(400).send(err);
    }
});
router.get("/login", (req, res) => {
    console.log(req.Session)
    console.log(req.sessions)
    console.log(req.session)
    res.render("login", {});
});
router.post("/login", async (req, res) => {
    const loguser = req.body;
    try {
        const result = await user.loginUser(loguser);
        console.log(result);
        if (result.error) {
            res.status(400).send(result);
        } else {
            delete result.password;
            delete result._id;
            delete result.__v;
            req.session.user = result;
            res.status(200).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).render("errors", { error: error });
        } else {
            res.redirect("login");
        }
    });
});

export default router;