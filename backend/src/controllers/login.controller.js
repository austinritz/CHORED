import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import crypto from "crypto";

export const loginUser = async (req, res, next) => {
        const authenticate = User.authenticate();
        authenticate('username', 'password', function(err, result) {
            if (err) { 
                console.log("couldn't auth");
                return res.status(404).json({ success: false, message: "Authentication error", error: err});
            }
            if (result)
            return res.status(200).json({ success: true, message: "User was authenticated", result: result });
            // Value 'result' is set to false. The user could not be authenticated since the user is not active
        });
}

export const registerUser = async (req, res, next) => {
    if (!req.body.password || !req.body.username) {
        return res.status(400).json({ success: false, message: "Please provide all fields"});
    }
    User.register({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
    }, req.body.password, function (err, user) {
        if (err) { 
            return res.status(404).json({ success: false, message: "User creation error", error: err});
        }
        return res.status(200).json({ success: true, message: "User was created", user: user });

        // const authenticate = User.authenticate();
        // authenticate('username', 'password', function(err, result) {
        //     if (err) { console.log("couldn't auth") }

        //     // Value 'result' is set to false. The user could not be authenticated since the user is not active
        // });
    });
};

export const logoutUser = async (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
};