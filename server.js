const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./user');

const app = express();


// Middleware

app.use(cors());

app.use(express.json());


// Routes

app.use('/', userRouter);


// Home route

app.get('/', (req, res) => {

    res.json({
        message: 'BESD-FN-321 API is running'
    });

});


// Start server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});