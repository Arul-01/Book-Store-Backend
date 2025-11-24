const Books = require("../models/bookModel.js");
const cloudinary = require("../config/cloudinary.js");

/* --------------------------------------------
   CLOUDINARY MEMORY BUFFER UPLOAD HELPER
--------------------------------------------- */
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "books" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

/* --------------------------------------------
   POST METHOD (ADD BOOK)
--------------------------------------------- */
const postmethod = async (req, res) => {
  try {
    const { title, author, genre, price } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await streamUpload(file.buffer);
        imageUrls.push(uploaded.secure_url);
      }
    }

    const book = new Books({ title, author, genre, price, images: imageUrls });
    const saved = await book.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(505).json({ message: err.message });
  }
};

/* --------------------------------------------
   GET ALL BOOKS
--------------------------------------------- */
const getmethod = async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    res.status(505).json({ message: err.message });
  }
};

/* --------------------------------------------
   GET ONE BOOK
--------------------------------------------- */
const getone = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Books.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching Book:", error);
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------------------
   PATCH METHOD (UPDATE BOOK PARTIALLY)
--------------------------------------------- */
const patchmethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, price, description, rating } = req.body;

    const book = await Books.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let imageUrls = book.images;

    // If new files uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (book.images && book.images.length > 0) {
        for (const imageUrl of book.images) {
          const parts = imageUrl.split("/");
          const publicIdWithExt = parts[parts.length - 1];
          const publicId = `books/${publicIdWithExt.split(".")[0]}`;

          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Cloudinary delete error:", err.message);
          }
        }
      }

      // Upload new images
      imageUrls = [];
      for (const file of req.files) {
        const uploaded = await streamUpload(file.buffer);
        imageUrls.push(uploaded.secure_url);
      }
    }

    const updatedBook = await Books.findByIdAndUpdate(
      id,
      { title, author, genre, price, description, images: imageUrls, rating },
      { new: true }
    );

    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------
   PUT METHOD (REPLACE BOOK)
--------------------------------------------- */
const putmethod = async (req, res) => {
  try {
    const { id } = req.params;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await streamUpload(file.buffer);
        imageUrls.push(uploaded.secure_url);
      }
    }

    const updatedBook = await Books.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        price: req.body.price,
        description: req.body.description,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      },
      { new: true }
    );

    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* --------------------------------------------
   DELETE METHOD
--------------------------------------------- */
const deletemethod = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Books.findById(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete from Cloudinary
    if (deletedBook.images && deletedBook.images.length > 0) {
      for (const imageUrl of deletedBook.images) {
        const parts = imageUrl.split("/");
        const publicIdWithExt = parts[parts.length - 1];
        const publicId = `books/${publicIdWithExt.split(".")[0]}`;

        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }
      }
    }

    await Books.findByIdAndDelete(id);

    res.json({ message: "Book deleted successfully", deletedBook });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  postmethod,
  getmethod,
  getone,
  patchmethod,
  deletemethod,
  putmethod,
};
