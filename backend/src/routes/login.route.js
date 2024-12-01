import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { logoutUser, registerUser } from '../controllers/login.controller.js'

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const router = express.Router();

router.get("/check", (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ authenticated: true, user: req.user});
    }
    return res.status(401).json({ authenticated: false, message: "Not authenticated"})
});

router.post("/login", passport.authenticate("local",{
    session: true,
}), function(req, res){
    return res.status(200).json({ success: true, message: "User was Authenticated", user: req.user });
});

router.post('/logout', logoutUser);

router.post('/register', registerUser);

export default router;
