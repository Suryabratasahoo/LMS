import BorrowedBooks from "@/models/BorrowedBooks";
import connectDB from "./connectDb";


export async function updateFines(){
    await connectDB();
    console.log("connected to db for fine updation");
    const today=new Date();

    const overDueBooks=await BorrowedBooks.find({due_date:{$lt:today},status:"Borrowed"});

    for(const book of overDueBooks){
        const overDueDays=Math.floor((today.getTime()-book.due_date.getTime())/(1000*60*60*24));
        if(overDueDays>0){
            const newFine=overDueDays*0.5;
            book.fine=newFine;
            await book.save();
            console.log(`Updated fine for book ${book._id}: ${newFine}`);
        }
    }
}