import passport from "passport";
import userModel from "../dao/models/user.models.js";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { SECRET_CODE } from "../utils/jwt.js";



const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;



const initializePassport = () => {

    passport.use("jwt", new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: SECRET_CODE,
        },
        async (jwtPayload, done) => {
            //console.log(jwtPayload);
            try {
                return done(null, jwtPayload);
            } catch (error) {
                return done(error)
            }
        }
    ))



    passport.use(new GithubStrategy({
        clientID: "448a7a8c190316d8842e",
        clientSecret: "e194960a807c3ada3596d6d9b31a967ea52b147a",
        callbackURL: "/api/v1/session/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user);
            } else {
                user = await userModel.create({
                    firstName: profile._json.name,
                    lastName: "",
                    age: 0,
                    email: profile._json?.email,
                    password: "",
                    role: "user",
                }); 
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }
    ));



    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById({ _id: id });;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}

export default initializePassport;