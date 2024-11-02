"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import axios, { AxiosError } from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";

interface AdminData {
  _id: string;
  username: string;
  email: string;
}

interface ApiResponse {
  admins: AdminData[];
}

const AdminProfileSettings = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get<ApiResponse>("/api/admin/settings/profile");
        if (response.data && response.data.admins && response.data.admins.length > 0) {
          setAdmins(response.data.admins);
        } else {
          toast.error("No admin data received");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          toast.error("Unauthorized - Please log in");
        } else if (axiosError.response?.status === 404) {
          toast.error("Admin profiles not found");
        } else {
          toast.error("Failed to fetch admin data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleEditClick = (admin: AdminData) => {
    setSelectedAdmin(admin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedAdmin) return;
      setSubmitting(true);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate username length
      if (formData.username.length < 3) {
        toast.error('Username must be at least 3 characters long');
        return;
      }

      // Validate password
      if (formData.password) {
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
      }

      const updateData = {
        username: formData.username,
        email: formData.email
      };

      const response = await axios.put(`/api/admin/settings/profile/${selectedAdmin._id}`, updateData);

      if (response.status === 200) {
        // Update local state with new data
        setAdmins(prevAdmins => 
          prevAdmins.map(admin => 
            admin._id === selectedAdmin._id 
              ? { ...admin, ...updateData }
              : admin
          )
        );
        toast.success('Profile updated successfully');
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        toast.error('Invalid input data');
      } else if (axiosError.response?.status === 404) {
        toast.error('Admin profile not found');
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminSidebar />
        <div className="flex-grow p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-full"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-gray-900"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminSidebar />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-grow p-6"
        >
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500 font-semibold">No admin profiles found</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8"
        >
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent"
          >
            Admin Profiles
          </motion.h1>
          
          <motion.div className="space-y-6">
            <AnimatePresence>
              {admins.map((admin, index) => (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">Username</h2>
                      <p className="text-gray-600">{admin.username}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">Email</h2>
                      <p className="text-gray-600">{admin.email}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={() => handleEditClick(admin)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        Edit Profile
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {isDialogOpen && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <DialogHeader>
                      <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid w-full items-center gap-1.5"
                      >
                        <Label htmlFor="username">Username</Label>
                        <input 
                          type="text"
                          id="username"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                          placeholder={selectedAdmin?.username}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid w-full items-center gap-1.5"
                      >
                        <Label htmlFor="email">Email</Label>
                        <input
                          type="email"
                          id="email"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                          placeholder={selectedAdmin?.email}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button 
                          onClick={handleSubmit} 
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <div className="flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="rounded-full h-5 w-5 border-b-2 border-white mr-2"
                              />
                              Saving...
                            </div>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminProfileSettings;
