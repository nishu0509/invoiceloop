const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/current-user', authMiddleware, async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: 'User verified successfully!',
            user: req.user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in current-user API'
        });
    }
});

module.exports = router;