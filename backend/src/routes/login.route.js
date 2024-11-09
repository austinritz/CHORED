import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { loginUser, logoutUser, signupUser } from '../controllers/login.controller.js'


// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     UserCredential.findOne({ username: username }).then(function verify(err, user) {
//       if (err) {
//         console.log("bad news")
//         return done(err); 
//       }
//       if (!user) { 
//         return done(null, false, { message: 'Username not found.' });
//       }
//       crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
//         console.log("good news...")
//         if (err) return callback(err);
//         const isValid = user.hashedPassword === hashedPassword.toString('hex');
//         if (!isValid){
//             return callback(null, false, { message: 'Incorrect username or password.' });
//         }
//         return callback(null, isValid);
//       });
//     });
//   }
// ));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const router = express.Router();

const isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
};

router.get("/login", (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(400).json({ message: "user already logged?", user: req.user});
    }
    return res.status(400).json({ message: "should you be in get login?"})
});

router.post("/login", passport.authenticate("local",{
    failureRedirect: "/auth/login",
    session: true,
}), function(req, res){
    return res.status(200).json({ success: true, message: "User was Authenticated", user: "l" });
});

router.post('/logout', logoutUser);

router.post('/signup', signupUser);

export default router;
