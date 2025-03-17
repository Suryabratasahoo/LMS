"use strict"
require("dotenv").config();
const mongoose=require("mongoose");

const Book=require("./models/Book");
const books=require("./books");

mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("mongoDb connected");
    insertBooks()
}
)
.catch((err: any) => console.log("mongo db error:", err))

async function insertBooks(){
    try{
        console.log(books);
        await Book.deleteMany({});
        await Book.insertMany(books);
        console.log("books added");
        mongoose.connection.close();
    }
    catch(err){
        console.log("error:",err);
    }
}
