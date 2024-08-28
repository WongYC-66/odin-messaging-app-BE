const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user')
// parent route : /users

/* POST user sign in. */
router.post('/sign-in/', user_controller.sign_in_post);

/* POST user sign up. */
router.post('/sign-up/', user_controller.sign_up_post);

/* POST user sign out. */
router.get('/sign-out/', user_controller.sign_out_get);

/* GET all user profile list. */
router.get('/profile/', user_controller.get_all_profiles);

/* GET user profile detail. */
router.get('/profile/:username', user_controller.profile_get);

/* UPDATE user profile detail. */
router.put('/profile/:username', user_controller.profile_update);

module.exports = router;
