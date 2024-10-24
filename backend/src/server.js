import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import householdRoutes from "./routes/household.route.js";
import userRoutes from "./routes/user.route.js";
import choreRoutes from "./routes/chore.route.js";

dotenv.config();

const app = express();

app.use(express.json()); // To use json data in the req.body

app.get('/', (req, res) => {
    res.send('Helloooo World');
});

app.use("/api/household", householdRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chore", choreRoutes);

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on port 3000 http://localhost:3000/');
});

