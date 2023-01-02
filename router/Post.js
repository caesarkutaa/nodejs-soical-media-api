const express = require('express')
const router = express.Router()
const { createpost, getpost, updatePost,deletePost,likePost,gettimelinePost } = require('../controllers/post')




router.post('/', createpost)
router.get('/:id', getpost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/:id/like', likePost)
router.get('/timeline/all', gettimelinePost)






module.exports = router;