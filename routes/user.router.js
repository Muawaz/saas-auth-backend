const express = require("express");
const router = express.Router();
const {
  createnewuser,
  verifyEmail,
  login,
  user_forgotPassword,
  user_resetPassword,
} = require("../controllers/AuthController.js");
const { adminAuth, userAuth } = require("../middlewares/auth.js");

/**
 * @swagger
 * /api/user/rigesteruser:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/rigesteruser", createnewuser);

/**
 * @swagger
 * /api/user/verify-email:
 *   get:
 *     summary: Verify user email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       404:
 *         description: User not found
 */
router.get("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', login);

/**
 * @swagger
 * /api/user/admin:
 *   get:
 *     summary: Admin route
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted
 */
router.get('/admin', adminAuth, (req, res) => res.send('Admin Route'))

/**
 * @swagger
 * /api/user/basic:
 *   get:
 *     summary: Basic user route
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User access granted
 */
router.get('/basic', userAuth, (req, res) => res.send('User Route'))

/**
 * @swagger
 * /api/user/forgotPassword:
 *   post:
 *     summary: Request a password reset
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/forgotPassword', user_forgotPassword);

/**
 * @swagger
 * /api/user/resetPassword:
 *   post:
 *     summary: Reset user password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */
router.post('/resetPassword', user_resetPassword)

module.exports = router;
