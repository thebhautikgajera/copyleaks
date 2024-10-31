import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/connectToDatabase";
import ContactMessage from "../../../../../../models/contactFormSchema";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;

    // Check if contact message exists
    const existingMessage = await ContactMessage.findById(id);

    if (!existingMessage) {
      return NextResponse.json(
        { message: "Contact message not found" },
        { status: 404 }
      );
    }

    // Check if message is starred
    if (existingMessage.isStarred) {
      return NextResponse.json(
        { message: "Cannot delete starred messages. Please unstar the message first." },
        { status: 403 }
      );
    }

    // Delete the contact message
    await ContactMessage.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Contact message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { message: "Error deleting contact message" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;
    const data = await request.json();

    // Check if contact message exists
    const existingMessage = await ContactMessage.findById(id);

    if (!existingMessage) {
      return NextResponse.json(
        { message: "Contact message not found" },
        { status: 404 }
      );
    }

    const updateData: { isRead?: boolean; isStarred?: boolean } = {};
    
    // Handle marking as read and persist to database
    if (data.markAsRead) {
      updateData.isRead = true;
      await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }

    // Handle starring/unstarring and persist to database
    if (typeof data.isStarred === 'boolean') {
      updateData.isStarred = data.isStarred;
      await ContactMessage.findByIdAndUpdate(id, { isStarred: data.isStarred }, { new: true });
    }

    return NextResponse.json(
      { message: "Contact message updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json(
      { message: "Error updating contact message" },
      { status: 500 }
    );
  }
}
