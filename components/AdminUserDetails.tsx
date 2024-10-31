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
import { FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

const AdminUserDetails = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users/user-details", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.data) {
          throw new Error("No data received");
        }

        setUsers(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        setError("");
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 404) {
          setError("User details endpoint not found. Please check the API route.");
        } else {
          setError("Failed to fetch users. Please try again later.");
        }
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getFilteredUsers = () => {
    return users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getCurrentPageData = () => {
    const filteredUsers = getFilteredUsers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setIsDeletingUser(true);
      await axios.delete(`/api/users/user-details/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUsers(users.filter(user => user._id !== id));
      setIsDialogOpen(false);
      setIsAlertDialogOpen(false);
      
      setTotalPages(Math.ceil((users.length - 1) / itemsPerPage));
      
      if (getCurrentPageData().length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      toast.success("User deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsDeletingUser(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 overflow-y-hidden">
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                User Details
              </h2>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">
                <p className="font-medium">{error}</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg shadow-sm">
                <p className="font-medium">No users found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-[200px]">Created At</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCurrentPageData().map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('en-GB', {
                            day: "numeric",
                            month: "long", 
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            View
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Username</h4>
                <p className="mt-1">{selectedUser.username}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Email</h4>
                <p className="mt-1">{selectedUser.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Created At</h4>
                <p className="mt-1">
                  {new Date(selectedUser.createdAt).toLocaleDateString('en-GB', {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => setIsAlertDialogOpen(true)}
                  disabled={isDeletingUser}
                >
                  {isDeletingUser ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeletingUser}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingUser}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleDeleteUser(selectedUser._id)}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeletingUser}
            >
              {isDeletingUser ? (
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

export default AdminUserDetails;
