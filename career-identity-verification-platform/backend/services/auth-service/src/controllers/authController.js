const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const logger = require('../config/logger');
const bcrypt = require('bcrypt');
const tokenUtils = require('../utils/tokenUtils');
const env = require('../config/env');

// Mock Email Service
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:3002/api/v1/auth/verify-email?token=${token}`;
    logger.info(`[MOCK EMAIL] To: ${email} | Subject: Verify your email | Link: ${verificationLink}`);
};

exports.register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await User.create({
            email,
            passwordHash,
            name,
            role: 'candidate', // FORCE CANDIDATE ROLE
            emailVerificationToken,
        });

        // Send verification email (Mock)
        await sendVerificationEmail(user.email, emailVerificationToken);

        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            userId: user._id,
        });
    } catch (error) {
        logger.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.internalRegister = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Validate role
        const allowedRoles = ['recruiter', 'executive', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role for internal registration' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user (Auto-verified)
        const user = await User.create({
            email,
            passwordHash,
            name,
            role,
            isEmailVerified: true, // Auto-verify
            status: 'active',
        });

        res.status(201).json({
            message: `Internal registration successful for role: ${role}`,
            userId: user._id,
        });
    } catch (error) {
        logger.error('Internal Registration Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const user = await User.findOne({ emailVerificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined; // Clear token
        user.status = 'active';
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        logger.error('Email Verification Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if email verified
        if (!user.isEmailVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        // Generate tokens
        const accessToken = tokenUtils.generateAccessToken(user);
        const refreshTokenString = tokenUtils.generateRefreshToken();

        // Save refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await RefreshToken.create({
            token: refreshTokenString,
            user: user._id,
            expiresAt,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        res.status(200).json({
            accessToken,
            refreshToken: refreshTokenString,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        logger.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh Token is required' });
        }

        const storedToken = await RefreshToken.findOne({ token: refreshToken }).populate('user');

        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Generate new access token
        const accessToken = tokenUtils.generateAccessToken(storedToken.user);

        // Rotate refresh token (optional security measure - implementing simple rotation)
        const newRefreshTokenString = tokenUtils.generateRefreshToken();
        storedToken.revoked = true; // Revoke old one
        await storedToken.save();

        // Create new one
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await RefreshToken.create({
            token: newRefreshTokenString,
            user: storedToken.user._id,
            expiresAt,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        res.status(200).json({
            accessToken,
            refreshToken: newRefreshTokenString,
        });
    } catch (error) {
        logger.error('Refresh Token Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revoked: true });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Logout Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.sub).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        logger.error('Get Me Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
