import connectDB from "@/lib/connectDb";
import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/Request";
import Notification from "@/models/Notification";
export async function GET(): Promise<NextResponse> {
  try {
    console.log("Hello I am here");
    await connectDB();
    const requests = await Request.find({status:"pending"}).populate("user", 'name regNumber');
    console.log(requests);
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const action = url.searchParams.get('action');
    const userId = url.searchParams.get('userId');
    const title=url.searchParams.get('title');

    if (!id || !action) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await connectDB();
    const request = await Request.findById(id);

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (action === "approve") {
      request.status = "approved";
      await request.save();
      const notification=new Notification({user:userId,message:`Your request for the book ${title} has been approved`,type:"Approval"})
      await notification.save();
      return NextResponse.json({ message: "Request has been approved" }, { status: 200 });
    } else {
      request.status = "rejected";
      await request.save();
      const notification=new Notification({user:userId,message:`Your request for the book ${title} has been approved`,type:"Rejection"})
      await notification.save();
      return NextResponse.json({ message: "Request has been rejected" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}