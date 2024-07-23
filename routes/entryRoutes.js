const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController.js');
const verifyJWT = require('../middleware/verifyJWT.js');

router.use(verifyJWT)

router.route('/addEntry')
  .post(entryController.addEntry)

router.route('/deleteEntry/:id')
  .delete(entryController.deleteEntryByID)

router.route('/editEntry/:id')
  .put(entryController.editEntryByID)

router.route('/getEntry/:id')
  .get(entryController.getEntryByID)

router.route('/searchEntries')
  .post(entryController.searchEntries)

router.route('/searchMyEntries')
  .post(entryController.searchMyEntries)

router.route('/profile/:id')
  .get(entryController.profileByID)

router.route('/updateProfile/:id')
  .put(entryController.updateProfileByID)

module.exports = router;