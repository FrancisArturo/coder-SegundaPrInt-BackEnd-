import { Router } from "express";
import UserManager from "../dao/managers/dbManagers/user.manager.js";
import passport from "passport";
//import userModel from "../dao/models/user.models.js";
import generateJWT from "../utils/jwt.js";



export default class sessionRoutes {
    path = "/session";
    router = Router();
    userManager = new UserManager();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/register`, async (req, res) => {
            try {
                const newUser = await this.userManager.createUser(req.body);
                if (newUser === "User already exists") {
                return res.status(400).json({message: "User already exists"})
                }
                return res.send("User added successfully");
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            
        }
        );


        this.router.post(`${this.path}/login`, async (req, res) => {
            try {
                const userLogin = await this.userManager.loginUser(req.body);
                if (userLogin === "User not found") {
                    return res.status(401).json({message: "User not found"});
                }
                if (userLogin === "Incorrect password") {
                    return res.status(401).json({message: "Incorrect password"});
                }
                const signUser = {
                    user: userLogin._id,
                    email: userLogin.email,
                    role: userLogin.role,
                }

                const token = await generateJWT({...signUser});
                console.log(token);
                return res.redirect("/views/home");
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            
            
        }
        );
        this.router.get(`${this.path}/failedlogin`, (req, res) => {
            res.send("failed login");
        }
        );
        this.router.get(`${this.path}/logout`, async (req, res) => {
            req.session.destroy( (err) => {
                if (!err) {
                    return res.redirect("/views/login");
                }
                return res.status(400).json({ message: err.message });
            });
        }
        );
        this.router.post(`${this.path}/recover`, async (req, res) => {
            try {
                const user = await this.userManager.recoverPassword(req.body);
                if (user === "User not found") {
                    return res.render("recover", {error: "User not found"});
                }
                // req.session.user = {
                //     firstName: user.firstName,
                //     lastName: user.lastName,
                //     email: user.email,
                //     role: user.role,
                // };
                return res.redirect("/views/login");
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
        );
        this.router.get(`${this.path}/github`, passport.authenticate("github", { scope: ["user:email"] }));
        this.router.get(`${this.path}/github/callback`, passport.authenticate("github", { failureRedirect: "/api/v1/session/failedlogin" }),
            async (req, res) => {
                try {
                    // req.session.user = {
                    //     firstName: req.user.firstName,
                    //     lastName: req.user.lastName,
                    //     email: req.user.email,
                    //     role: req.user.role,
                    // };
                    return res.redirect("/views/home");
                } catch (error) {
                    return res.status(400).json({ message: error.message });
                }
            }
        );
    }
}

