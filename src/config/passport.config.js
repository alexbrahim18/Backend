import passport from "passport";
import local, { Strategy } from "passport-local";
import UserModel from "../dao/models/user.model.js";
import GithubModel from "../dao/models/github.model.js";
import GitHubStrategy from "passport-github2"; // traemos la strat
import { createHash, isValidPassword } from "../password.utils.js";
import dotenv from "dotenv";

// traemos la config de .env
dotenv.config();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
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
          const user = await UserModel.findOne({ email: username });

          if (user) {
            console.log("El usuario ya existe!");
            return done(null, false);
          }

          const hashedPassword = createHash(password);

          const newUser = {
            first_name,
            last_name,
            age,
            email,
            password: hashedPassword,
          };

          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done("Error en la contraseña " + err);
        }
      }
    )
  );

  // configuramos
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/githubcallback",
      },
      async (accessToke, refreshToken, profile, done) => {
        console.log(profile);

        try {
          const user = await GithubModel.findOne({
            email: profile._json.email,
          });
          if (user) return done(null, user);

          const newUser = await GithubModel.create({
            first_name: profile._json.name,
            email: profile._json.email,
          });

          return done(null, newUser);
        } catch (err) {
          return done("error to login with GitHub " + err);
        }

        done(null, profile);
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            console.log("El usuario ingresado no existe");
            return done(null, false);
          }

          if (!isValidPassword(user, password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          done("Error" + err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    return done(null, user);
  });
};

export default initializePassport;