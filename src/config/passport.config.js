import passport from "passport";
import mongoose from "mongoose";
import local from "passport-local";
import passport_jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";
import  userModel  from "../models/user.model.js";
import {
    createHash,
    isValidPassword,
    generateToken,
    extractCookie,
} from "../utils.js";
import config from "./config.js";
import dotenv from "dotenv";

dotenv.config()

const userModelpp = mongoose.model(userModel.userCollection, userModel.userSchema)

const LocalStrategy = local.Strategy;
const GithubStrategy = GitHubStrategy.Strategy;
const JWTStrategy = passport_jwt.Strategy;
const JWTExtract = passport_jwt.ExtractJwt;

const initializePassport = () => {
    // registro de usuario
    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                const { first_name, last_name, age, email } = req.body;
                try {
                    const regex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,120}$/;
                    let errortxt = [];
                    (!first_name || first_name.length === 0) &&
                        errortxt.push("first_name es obligatorio.");
                    (!last_name || last_name.length === 0) &&
                        errortxt.push("last_name es obligatorio.");
                    (!email || email.length === 0) &&
                        errortxt.push("email es obligatorio.");
                    (!age || age.length === 0) &&
                        errortxt.push("age es obligatorio.");
                    age &&
                        (isNaN(age) || Number.isInteger(age) || age <= 0) &&
                        errortxt.push("age tiene que ser un número positivo.");
                    (!password || !regex.test(password)) &&
                        errortxt.push(
                            "password debe tener al entre 8 y 120 caracteres, al menos una mayúscula, una minúscula y un caracter especial."
                        );
                    const found = await userModelpp
                        .findOne({ email: email })
                        .lean()
                        .exec();
                    if (found !== null) {
                        errortxt.push(
                            "Ya se encuentra un usuario registrado con el mismo correo electrónico."
                        );
                    }
                    if (errortxt.length > 0) {
                        return done(null, false);
                    } else {
                        const user = {
                            first_name,
                            last_name,
                            email,
                            age,
                            password: createHash(password),
                        };
                        const newUser = await userModelpp.create(user);
                        return done(null, newUser);
                    }
                } catch (error) {
                    return done({ error: 6, errortxt: error });
                }
            }
        )
    );
    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    if (
                        username === process.env.ADMIN_MAIL &&
                        password === process.env.ADMIN_PASS
                    ) {
                        const found = {
                            _id: config.ADMIN_EMAIL,
                            first_name: "Admin",
                            last_name: "Coder",
                            email: config.ADMIN_EMAIL,
                            age: 0,
                            role: "admin",
                            cart: null,
                        };
                        const token = generateToken(found);
                        found.token = token;
                        return done(null, found);
                    } else {
                        const found = await userModelpp.findOne({
                            email: username,
                        });
                        if (
                            found !== null &&
                            isValidPassword(found, password)
                        ) {
                            const token = generateToken(found);
                            found.token = token;
                            return done(null, found);
                        } else {
                            return done(null, false);
                        }
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: config.CLIENT_ID,
                clientSecret: config.CLIENT_SECRET,
                callbackURL: "http://localhost:8080/githubcallback",
                scope: ["user:email"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const useremail = profile._json.email
                        ? profile._json.email
                        : profile.emails[0].value;

                    let user = await userModelpp.findOne({
                        email: useremail,
                    });
                    if (!user) {
                        const adduser = {
                            first_name: profile._json.name,
                            last_name: profile._json.login,
                            email: useremail,
                            age: 0,
                            password: " ",
                        };
                        const newUser = await userModelpp.create(adduser);
                        return done(null, newUser);
                    }
                    return done(null, user);
                } catch (error) {
                    done(error);
                }
            }
        )
    );
    passport.use(
        "jwt",
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
                secretOrKey: config.JWT_SECRET,
            },
            async (jwt_payload, done) => {
                done(null, jwt_payload.user);
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        if (id === config.ADMIN_EMAIL) {
            const user = {
                _id: config.ADMIN_EMAIL,
                first_name: "Admin",
                last_name: "Coder",
                email: config.ADMIN_EMAIL,
                age: 0,
                role: "admin",
                cart: null,
            };
            done(null, user);
        } else {
            const user = await userModelpp.findById(id);
            done(null, user);
        }
    });
};

export default initializePassport;