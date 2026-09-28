const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');

const router = express.Router();


// =====================================================
// GET /users
// Retrieve all users
// =====================================================

router.get('/users', async (req, res) => {

    try {

        const [rows] = await pool.query(
            `SELECT
                userEmail,
                userFirstName,
                userLastName,
                userTel,
                dateOfBirth
             FROM \`user\``
        );

        res.status(200).json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Database server error'
        });
    }
});


// =====================================================
// POST /users
// Register new user
// =====================================================

router.post('/users', async (req, res) => {

    try {

        const {
            userEmail,
            userPassword,
            userFirstName,
            userLastName,
            userTel,
            dateOfBirth
        } = req.body;


        // ---------------------------------------------
        // Validate required fields
        // ---------------------------------------------

        if (
            !userEmail ||
            !userPassword ||
            !userFirstName ||
            !userLastName ||
            !userTel ||
            !dateOfBirth
        ) {

            return res.status(400).json({
                error: 'Missing mandatory fields'
            });
        }


        // ---------------------------------------------
        // Check duplicate email
        // ---------------------------------------------

        const [existing] = await pool.query(
            'SELECT userEmail FROM `user` WHERE userEmail = ?',
            [userEmail]
        );

        if (existing.length > 0) {

            return res.status(409).json({
                error: 'Email already exists'
            });
        }


        // ---------------------------------------------
        // Hash password
        // ---------------------------------------------

        const hashedPassword =
            await bcrypt.hash(userPassword, 10);


        // ---------------------------------------------
        // Insert user
        // ---------------------------------------------

        await pool.query(
            `INSERT INTO \`user\`
            (
                userEmail,
                userPassword,
                userFirstName,
                userLastName,
                userTel,
                dateOfBirth
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userEmail,
                hashedPassword,
                userFirstName,
                userLastName,
                userTel,
                dateOfBirth
            ]
        );


        // ---------------------------------------------
        // Success
        // ---------------------------------------------

        res.status(201).json({
            message: 'Created'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Server error'
        });
    }
});


// =====================================================
// Alias required by instruction: POST /user/signup
// =====================================================

router.post('/user/signup', async (req, res) => {

    try {

        const {
            userEmail,
            userPassword,
            userFirstName,
            userLastName,
            userTel,
            dateOfBirth
        } = req.body;


        if (
            !userEmail ||
            !userPassword ||
            !userFirstName ||
            !userLastName ||
            !userTel ||
            !dateOfBirth
        ) {

            return res.status(400).json({
                error: 'Missing mandatory fields'
            });
        }


        const [existing] = await pool.query(
            'SELECT userEmail FROM `user` WHERE userEmail = ?',
            [userEmail]
        );


        if (existing.length > 0) {

            return res.status(409).json({
                error: 'Email already exists'
            });
        }


        const hashedPassword =
            await bcrypt.hash(userPassword, 10);


        await pool.query(
            `INSERT INTO \`user\`
            (
                userEmail,
                userPassword,
                userFirstName,
                userLastName,
                userTel,
                dateOfBirth
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userEmail,
                hashedPassword,
                userFirstName,
                userLastName,
                userTel,
                dateOfBirth
            ]
        );


        res.status(201).json({
            message: 'Created'
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: 'Server error'
        });
    }
});


module.exports = router;