import express from 'express';
import { fileStore } from '../storage/fileStore.js';

const router = express.Router();

// POST /api/auth/login - Universal multi-user login endpoint
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const user = fileStore.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please verify your credentials.'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        sessionRevoked: true,
        message: 'This account has been suspended or deactivated by the administrator.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password. Please verify your credentials.'
      });
    }

    res.json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role || 'guest',
          fieldOfStudy: user.fieldOfStudy || '',
          skills: user.skills || [],
          avatarUrl: user.avatarUrl || '',
          isActive: user.isActive !== false,
          sessionVersion: user.sessionVersion || 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/verify-session - Session validity check (detects force-logouts)
router.post('/verify-session', (req, res) => {
  try {
    const { username, sessionVersion } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    const user = fileStore.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        sessionRevoked: true,
        message: 'User account no longer exists.'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        sessionRevoked: true,
        message: 'Account has been deactivated.'
      });
    }

    const currentVersion = user.sessionVersion || 1;
    if (sessionVersion !== undefined && sessionVersion !== null && parseInt(sessionVersion, 10) < currentVersion) {
      return res.status(401).json({
        success: false,
        sessionRevoked: true,
        message: 'Session has been revoked or logged out by the administrator.'
      });
    }

    res.json({
      success: true,
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role || 'guest',
        isActive: user.isActive !== false,
        sessionVersion: currentVersion
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
