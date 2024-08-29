const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const reportController = require('../controllers/reportController'); 
const authMiddleware = require('../middleware/authMiddleware');
const checkOwner = require('../middleware/checkOwner');
const adminMiddleware = require('../middleware/adminMiddleware');
const { check } = require('express-validator');


// Define the routes
router.get('/vulnerabilities/', reportController.getAllReports);
router.post('/vulnerabilities', authMiddleware, upload.array('attachments'), reportController.createReport);
router.get('/vulnerabilities/search/', reportController.searchReports);
router.get('/vulnerabilities/pending', authMiddleware, adminMiddleware, reportController.getPendingReports);

router.get('/vulnerabilities/:id/', reportController.getReportById);
router.put('/vulnerabilities/:id/edit', authMiddleware, checkOwner, upload.array('attachments'), reportController.updateReport);
router.delete('/vulnerabilities/:id/delete', authMiddleware, checkOwner, reportController.deleteReport);
router.post('/vulnerabilities/:id/review/', authMiddleware, adminMiddleware, reportController.reviewReport);

router.get('/vulnerabilities/attachments/:id/:filename/', reportController.getAttachment);

module.exports = router;
