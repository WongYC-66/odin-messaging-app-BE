const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user')

/* POST user sign in. */
router.post('/sign-in/', user_controller.sign_in_post);

/* POST user sign up. */
router.post('/sign-up/', user_controller.sign_up_post);

/* POST user sign out. */
router.get('/sign-out/', user_controller.sign_out_get);

module.exports = router;
