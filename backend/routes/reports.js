const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const reportController = require('../controllers/reportController'); 
const authMiddleware = require('../middleware/authMiddleware');
const checkOwner = require('../middleware/checkOwner');
const { check } = require('express-validator');

// const pool = require('../config/database');
// const path = require('path');
// const fs = require('fs');

// Define the routes
router.get('/vulnerabilities/', reportController.getAllReports);
router.get('/vulnerabilities/search/', reportController.searchReports);
router.get('/vulnerabilities/:id/', reportController.getReportById);


// Protected routes
// router.post('/vulnerabilities/', upload.array('attachments'), reportController.createReport);
// router.put('/vulnerabilities/:id/edit', upload.array('attachments'), reportController.updateReport);
// router.delete('/vulnerabilities/:id/delete', reportController.deleteReport);

router.post('/vulnerabilities', authMiddleware, upload.array('attachments'), reportController.createReport);
// router.put('/vulnerabilities/:id/edit', authMiddleware, upload.array('attachments'), reportController.updateReport);
// router.delete('/vulnerabilities/:id/delete', authMiddleware, reportController.deleteReport);


router.put('/vulnerabilities/:id/edit', authMiddleware, checkOwner, upload.array('attachments'), reportController.updateReport);
router.delete('/vulnerabilities/:id/delete', authMiddleware, checkOwner, reportController.deleteReport);

router.get('/vulnerabilities/attachments/:id/:filename/', reportController.getAttachment);

module.exports = router;
