const express = require('express');
const upload = require('../config/multer.js');

const booksRouter = express.Router();
const { postmethod,getmethod,patchmethod,deletemethod, getone,putmethod } = require('../controllers/bookController.js'); 
const { protect, adminOnly } = require('../middleware/authMiddleware'); 


// booksRouter.post('/add-book', upload.single("image"), postmethod);

booksRouter.post('/add-book', protect,adminOnly,upload.array('images', 10), postmethod);

booksRouter.get('/', getmethod);

booksRouter.get('/:id', getone);

booksRouter.patch('/:id',protect,adminOnly, upload.array('images', 10),patchmethod);

booksRouter.put('/:id',protect,adminOnly, upload.array('images', 10),putmethod);

booksRouter.delete('/:id',protect,adminOnly,deletemethod);

module.exports = booksRouter;
