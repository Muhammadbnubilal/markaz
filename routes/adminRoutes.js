const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const isAuth = require('../middleware/auth');

// Brute protection for secure access point
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many entry attempts. Please wait 15 minutes before retrying.'
});

router.get('/login', loginLimiter, adminController.getLogin);
router.post('/login', loginLimiter, adminController.postLogin);
router.get('/logout', adminController.logout);

// Protected Control Group Actions
router.get('/dashboard', isAuth, adminController.getDashboard);
router.get('/applications', isAuth, adminController.getApplications);
router.post('/applications/update', isAuth, adminController.updateApplicationStatus);
router.post('/applications/delete', isAuth, adminController.deleteApplication);

router.get('/notices', isAuth, adminController.getNotices);
router.post('/notices/add', isAuth, adminController.addNotice);
router.post('/notices/edit', isAuth, adminController.editNotice);
router.post('/notices/delete', isAuth, adminController.deleteNotice);

router.get('/events', isAuth, adminController.getEvents);
router.post('/events/add', isAuth, adminController.addEvent);
router.post('/events/edit', isAuth, adminController.editEvent);
router.post('/events/delete', isAuth, adminController.deleteEvent);

router.get('/settings', isAuth, adminController.getSettings);
router.post('/settings/update', isAuth, adminController.updateSettings);

router.get('/messages', isAuth, adminController.getMessages);

module.exports = router;