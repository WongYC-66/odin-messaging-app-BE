var express = require('express');
var router = express.Router();

const chat_controller = require('../controllers/chat')
// parent route : /chats

/* get list of chat/groupchaps */
router.get('/', chat_controller.get_all_chats);

router.post('/', chat_controller.create_new_chat);

router.get('/:chatId/', chat_controller.get_one_chat);

router.post('/:chatId/', chat_controller.post_new_msg);

module.exports = router;
