const express = require('express');
const { registerUser, loginUser,getAllUsers, deleteUser } = require('../controllers/userController');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', protect, adminOnly, getAllUsers);

router.delete('/:id',protect, adminOnly,deleteUser);


module.exports = router;

