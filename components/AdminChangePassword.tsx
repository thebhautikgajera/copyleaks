"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import axios, { AxiosError } from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Eye, EyeOff } from 'lucide-react';

interface AdminData {
  _id: string;
  username: string;
  email: string;
}

const AdminChangePassword = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/settings/profile");
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
        } else {
          toast.error("Failed to fetch admin data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleChangePasswordClick = (admin: AdminData) => {
    setSelectedAdmin(admin);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    setIsDialogOpen(true);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAdmin) return;

    // Validate passwords
    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setUpdating(true);
    setIsSubmitting(true);

    try {
      const response = await axios.put(`/api/admin/settings/profile/password/${selectedAdmin._id}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.status === 200) {
        toast.success('Password updated successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        toast.error('Current password is incorrect');
      } else if (axiosError.response?.status === 401) {
        toast.error('Unauthorized - Please log in');
      } else if (axiosError.response?.status === 404) {
        toast.error('Admin not found');
      } else {
        toast.error('Failed to change password');
      }
    } finally {
      setUpdating(false);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen"
      >
        <AdminSidebar />
        <div className="flex-grow p-6">
          <div className="flex justify-center items-center h-full">
            <motion.div
              animate={{ 
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="rounded-full h-12 w-12 border-b-2 border-gray-900"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen"
    >
      <AdminSidebar />
      <div className="flex-grow p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-6"
          >
            Admin Password Management
          </motion.h2>
          <motion.div 
            className="grid gap-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {admins.map((admin) => (
              <motion.div
                key={admin._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{admin.username}</p>
                  <p className="text-gray-600">{admin.email}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={() => handleChangePasswordClick(admin)}>
                    Change Password
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isDialogOpen && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <DialogHeader>
                    <DialogTitle>Change Password for {selectedAdmin?.username}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className="w-full mt-1 p-2 border rounded-md pr-10"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showPasswords.current ? "Hide current password" : "Show current password"}
                        >
                          {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className="w-full mt-1 p-2 border rounded-md pr-10"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showPasswords.new ? "Hide new password" : "Show new password"}
                        >
                          {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative flex items-center">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full mt-1 p-2 border rounded-md pr-10"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showPasswords.confirm ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button type="submit" className="w-full" disabled={updating || isSubmitting}>
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <motion.div
                              animate={{ 
                                rotate: 360,
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              className="h-5 w-5 border-b-2 border-white rounded-full mr-2"
                            />
                            Updating...
                          </div>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        <ToastContainer position="bottom-right" />
      </div>
    </motion.div>
  );
};

export default AdminChangePassword;