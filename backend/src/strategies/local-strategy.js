import passport from 'passport';
import { Strategy } from 'passport-local';
import mongoose from 'mongoose';
import User from '../models/User.js';

// We can specify what the username field is with something like new Strategy({ usernameField: 'email'}, ...

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));