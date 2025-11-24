const mongoose= require('mongoose');

const bookSchema=new mongoose.Schema({
    title: {type:String,required:true},
    author: {type:String,required:true},
    genre: {type:String,required:true},
    price: {type:Number,required:false},
    description: {type:String,required:false},
    inStock: {type:Boolean,required:false},
    rating: {type:Number,required:false},
    isbn: {type:String,required:false},
    images: [String]
});

const BooksModel=mongoose.model('Book',bookSchema);

module.exports=BooksModel;
