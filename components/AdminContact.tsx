"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import axios, { AxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../components/ui/pagination";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import mongoose from "mongoose";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ScrollArea } from "../components/ui/scroll-area";
import { Star, Search } from 'lucide-react';

interface Contact {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  subject: string;
  topic: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isStarred: boolean;
  lastReadAt?: Date;
  lastStarredAt?: Date;
}

const AdminContact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [isTogglingStarred, setIsTogglingStarred] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/users/contact/contact-message", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.data) {
          throw new Error("No data received");
        }

        const contactsWithObjectId = response.data.map((contact: { _id: string; isRead: boolean; isStarred: boolean; lastReadAt?: Date; lastStarredAt?: Date }) => ({
          ...contact,
          _id: new mongoose.Types.ObjectId(contact._id),
          isRead: contact.isRead,
          isStarred: contact.isStarred,
          lastReadAt: contact.lastReadAt,
          lastStarredAt: contact.lastStarredAt
        }));

        setContacts(contactsWithObjectId);
        setFilteredContacts(contactsWithObjectId);
        setTotalPages(Math.ceil(contactsWithObjectId.length / itemsPerPage));
        setError("");
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 404) {
          setError("Contact details endpoint not found. Please check the API route.");
        } else {
          setError("Failed to fetch contacts. Please try again later.");
        }
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter((contact) => {
      const searchFields = [
        contact.name.toLowerCase(),
        contact.email.toLowerCase(),
        contact.subject.toLowerCase(),
        contact.topic.toLowerCase(),
        contact.message.toLowerCase(),
      ];
      return searchFields.some((field) => field.includes(searchTerm.toLowerCase()));
    });
    setFilteredContacts(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, contacts]);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContacts.slice(startIndex, endIndex);
  };

  const handleViewMessage = (contact: Contact) => {
    setSelectedMessage(contact);
    setIsDialogOpen(true);
  };

  const handleMarkAsRead = async (id: mongoose.Types.ObjectId) => {
    try {
      setIsMarkingAsRead(true);
      await axios.patch(`/api/users/contact/contact-message/${id.toString()}`, {
        markAsRead: true,
        lastReadAt: new Date()
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setContacts(contacts.map(contact => 
        contact._id.equals(id) ? { ...contact, isRead: true, lastReadAt: new Date() } : contact
      ));
      setSelectedMessage(prev => prev ? { ...prev, isRead: true, lastReadAt: new Date() } : null);
      toast.success('Message marked as read');
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error('Failed to mark message as read');
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  const handleToggleStarred = async (id: mongoose.Types.ObjectId) => {
    try {
      setIsTogglingStarred(true);
      const messageToUpdate = contacts.find(contact => contact._id.equals(id));
      const newStarredStatus = !messageToUpdate?.isStarred;

      await axios.patch(`/api/users/contact/contact-message/${id.toString()}`, {
        isStarred: newStarredStatus,
        lastStarredAt: newStarredStatus ? new Date() : undefined
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setContacts(contacts.map(contact => 
        contact._id.equals(id) ? { 
          ...contact, 
          isStarred: newStarredStatus,
          lastStarredAt: newStarredStatus ? new Date() : undefined
        } : contact
      ));
      setSelectedMessage(prev => prev ? { 
        ...prev, 
        isStarred: newStarredStatus,
        lastStarredAt: newStarredStatus ? new Date() : undefined
      } : null);
      toast.success(newStarredStatus ? 'Message starred' : 'Message unstarred');
    } catch (error) {
      console.error("Error toggling starred status:", error);
      toast.error('Failed to update starred status');
    } finally {
      setIsTogglingStarred(false);
    }
  };

  const handleDeleteMessage = async (id: mongoose.Types.ObjectId) => {
    const messageToDelete = contacts.find(contact => contact._id.equals(id));
    if (messageToDelete?.isStarred) {
      toast.error('Cannot delete starred messages');
      return;
    }

    try {
      setIsDeletingMessage(true);
      await axios.delete(`/api/users/contact/contact-message/${id.toString()}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedContacts = contacts.filter(contact => !contact._id.equals(id));
      setContacts(updatedContacts);
      setFilteredContacts(updatedContacts);
      setIsDialogOpen(false);
      setIsAlertDialogOpen(false);
      
      // Recalculate total pages
      setTotalPages(Math.ceil(updatedContacts.length / itemsPerPage));
      
      // Adjust current page if necessary
      if (getCurrentPageData().length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      toast.success('Message deleted successfully');
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error('Failed to delete message. Please try again.');
    } finally {
      setIsDeletingMessage(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="fixed top-0 left-0">
            <AdminSidebar />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 p-8 ml-64"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">
              Contact Form Submissions
            </h2>

            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, subject, topic, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full max-w-xl h-9 rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">
                <p className="font-medium">{error}</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg shadow-sm">
                <p className="font-medium">
                  {searchTerm ? "No matching contacts found." : "No contact submissions found."}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead className="w-[150px]">Submitted At</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCurrentPageData().map((contact) => (
                      <TableRow 
                        key={contact._id.toString()}
                        className={`${contact.isStarred ? "bg-yellow-100" : !contact.isRead ? "bg-blue-100" : ""}`}
                      >
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell>{contact.topic}</TableCell>
                        <TableCell>
                          {new Date(contact.createdAt).toLocaleDateString('en-GB', {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMessage(contact)}
                            className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 hover:text-white text-white border-none shadow-md hover:shadow-lg transition-all duration-200 font-medium rounded-full px-4"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="py-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage(index + 1)}
                            isActive={currentPage === index + 1}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <ScrollArea className="h-full max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">From</h4>
                  <p>{selectedMessage.name} ({selectedMessage.email})</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">Subject</h4>
                  <p>{selectedMessage.subject}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">Topic</h4>
                  <p>{selectedMessage.topic}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">Message</h4>
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-bold">Submitted At</h4>
                  <p>{new Date(selectedMessage.createdAt).toLocaleDateString('en-GB', {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => handleToggleStarred(selectedMessage._id)}
                    disabled={isTogglingStarred}
                    className={selectedMessage.isStarred ? "bg-yellow-100" : ""}
                  >
                    {isTogglingStarred ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </div>
                    ) : (
                      <>
                        <Star className={`mr-2 h-4 w-4 ${selectedMessage.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        {selectedMessage.isStarred ? "Unstar" : "Star"}
                      </>
                    )}
                  </Button>
                  {!selectedMessage.isRead && (
                    <Button
                      variant="secondary"
                      onClick={() => handleMarkAsRead(selectedMessage._id)}
                      disabled={isMarkingAsRead}
                    >
                      {isMarkingAsRead ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                          Marking as read...
                        </div>
                      ) : (
                        "Mark as Read"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => setIsAlertDialogOpen(true)}
                    disabled={isDeletingMessage || selectedMessage.isStarred}
                  >
                    {isDeletingMessage ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </div>
                    ) : (
                      "Delete Message"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isDeletingMessage || isMarkingAsRead || isTogglingStarred}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this message
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingMessage}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMessage && handleDeleteMessage(selectedMessage._id)}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeletingMessage || (selectedMessage?.isStarred ?? false)}
            >
              {isDeletingMessage ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ToastContainer />
    </>
  );
};

export default AdminContact;
