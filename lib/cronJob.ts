import cron from 'node-cron';
import { updateFines } from './fineUpdater';
import connectDB from './connectDb';

async function runFineUpdate(){
    await connectDB();
    console.log("Running scheduled fine update")
    await updateFines();
}

// run everyday at midnight
cron.schedule("0 0 * * *",()=>{
    console.log("⏰ Running fine update cron job...");
    runFineUpdate();
})