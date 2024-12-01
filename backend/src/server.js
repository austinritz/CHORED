import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import passport from 'passport';

import householdRoutes from "./routes/household.route.js";
import userRoutes from "./routes/user.route.js";
import choreRoutes from "./routes/chore.route.js";
import loginRoute from "./routes/login.route.js"

dotenv.config();

const app = express();

app.use(express.json()); // To use json data in the req.body
app.use(
    session({
        secret: 'austin the dev',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
            secure: true,
            httpOnly: true,
            sameSite: "strict"
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/household", householdRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chore", choreRoutes);
app.use("/api/auth", loginRoute)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port 3000 http://localhost:3000/');
});
