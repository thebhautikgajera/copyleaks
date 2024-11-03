"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
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
} from "../components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 9;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: { 
      scale: 1.01,
      backgroundColor: "rgba(0,0,0,0.02)",
      transition: { duration: 0.2 }
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/user-details", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data) {
        throw new Error("No data received");
      }

      // Sort users by createdAt in descending order (newest first)
      const sortedUsers = response.data.sort((a: User, b: User) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setUsers(sortedUsers);
      setTotalPages(Math.ceil(sortedUsers.length / itemsPerPage));
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

      toast.success("User deleted successfully!");
      
      // Refresh the users list after deletion
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AdminSidebar />
        <div className="flex-grow p-6 flex justify-center items-center">
          <motion.div 
            className="h-12 w-12 border-4 border-gray-900 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="fixed top-0 left-0">
            <AdminSidebar />
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 p-8 ml-64"
          >
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                User Details
              </h2>
              <motion.div 
                variants={itemVariants}
                className="relative w-64"
              >
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </motion.div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
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
                  {getCurrentPageData().map((user, index) => (
                    <motion.tr
                      key={user._id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      custom={index}
                      className="group"
                    >
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                          day: "numeric",
                          month: "long", 
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </motion.button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              <motion.div 
                variants={itemVariants}
                className="py-4 border-t"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                      >
                        Previous
                      </motion.button>
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === index + 1
                              ? "bg-gray-900 text-white"
                              : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </motion.button>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                      >
                        Next
                      </motion.button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className="space-y-4"
            >
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
              <motion.div 
                className="flex justify-end gap-2 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAlertDialogOpen(true)}
                  disabled={isDeletingUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isDeletingUser ? "Deleting..." : "Delete"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeletingUser}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAlertDialogOpen(false)}
              disabled={isDeletingUser}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectedUser && handleDeleteUser(selectedUser._id)}
              disabled={isDeletingUser}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 ml-3"
            >
              {isDeletingUser ? "Deleting..." : "Delete"}
            </motion.button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ToastContainer />
    </>
  );
};

export default AdminUserDetails;
