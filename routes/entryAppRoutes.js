// routes/entryRoutes.js
const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController.js');
const upload = require('../middleware/upload.js');

router.route('/addEntry')
  .post(upload.single('image'), entryController.addEntry);

router.route('/deleteEntry/:id')
  .delete(entryController.deleteEntryByID);

router.route('/editEntry/:id')
  .put(upload.single('image'), entryController.editEntryByID);

router.route('/getEntry/:id')
  .get(entryController.getEntryByID);

router.route('/searchEntries')
  .post(entryController.searchEntries);

router.route('/searchMyEntries')
  .post(entryController.searchMyEntries);

router.route('/profile/:id')
  .get(entryController.profileByID);

router.route('/updateProfile/:id')
  .put(entryController.updateProfileByID);

module.exports = router;
