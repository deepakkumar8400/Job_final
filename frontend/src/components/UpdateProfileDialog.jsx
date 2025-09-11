import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, X, Upload, User, Mail, Phone, BookOpen, Code, FileText } from 'lucide-react';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        fullname: "John Doe",
        email: "eeeexjdjdj@gmail.com",
        phoneNumber: "45454",
        bio: "bskcljbs",
        skills: "sdnmfbsm, bsdfbscfs",
        file: null
    });

    const handleClose = () => {
        setOpen(false);
    };

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
            alert('Profile updated successfully!');
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white rounded-lg">
                {/* Header with double cross (close button) */}
                <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
                <DialogTitle className="text-xl font-bold text-gray-800">
                    Update Profile
                </DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid gap-5">
                        {/* Full Name Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="fullname" className="text-sm font-medium flex items-center gap-2">
                                <User size={16} className="text-blue-500" />
                                Full Name
                            </Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                className="w-full pl-3"
                                placeholder="Enter your full name"
                            />
                        </div>
                        
                        {/* Email Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                <Mail size={16} className="text-blue-500" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className="w-full pl-3"
                                placeholder="Enter your email address"
                            />
                        </div>
                        
                        {/* Phone Number Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
                                <Phone size={16} className="text-blue-500" />
                                Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className="w-full pl-3"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        
                        {/* Bio Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                                <BookOpen size={16} className="text-blue-500" />
                                Bio
                            </Label>
                            <Input
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                className="w-full pl-3"
                                placeholder="Tell us about yourself"
                            />
                        </div>
                        
                        {/* Skills Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="skills" className="text-sm font-medium flex items-center gap-2">
                                <Code size={16} className="text-blue-500" />
                                Skills (comma separated)
                            </Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                className="w-full pl-3"
                                placeholder="e.g. JavaScript, React, Node.js"
                            />
                        </div>
                        
                        {/* Resume Upload Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="file" className="text-sm font-medium flex items-center gap-2">
                                <FileText size={16} className="text-blue-500" />
                                Resume (PDF only)
                            </Label>
                            <div className="flex items-center gap-3">
                                <Label 
                                    htmlFor="file" 
                                    className="flex flex-1 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                                >
                                    <span className="text-gray-500">
                                        {input.file ? input.file.name : "Choose file"}
                                    </span>
                                    <Upload size={16} className="text-gray-400" />
                                </Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Upload your resume in PDF format</p>
                        </div>
                    </div>
                    
                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-6 pb-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleClose}
                            className="px-5"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="px-5 bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating
                                </>
                            ) : "Update Profile"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;