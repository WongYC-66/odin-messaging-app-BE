var express = require('express');
var router = express.Router();

const chat_controller = require('../controllers/chat')

/* get list of chat/groupchaps */
router.get('/', chat_controller.get_all_chats);

router.post('/:chatId', chat_controller.post_new_chat);

router.post('/:chatId/new', chat_controller.post_new_msg);

module.exports = router;
