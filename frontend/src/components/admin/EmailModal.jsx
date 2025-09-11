import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import the Textarea component
import { Mail, Send, X } from 'lucide-react';

const EmailModal = ({ open, onOpenChange, job, onSendEmail, loading }) => {
    const [emailData, setEmailData] = useState({
        to: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        if (job) {
            setEmailData(prevData => ({
                ...prevData,
                subject: `Job Opportunity: ${job.title} at ${job.company?.name || job.company}`,
                message: `Dear Job Seeker,
                
We have an exciting opportunity for a ${job.title} at ${job.company?.name || job.company}.
                
You can view more details and apply by visiting our website.
                
Best regards,
The JobPortal Team`
            }));
        } else {
            setEmailData(prevData => ({
                ...prevData,
                subject: "New Job Opportunities Available",
                message: "Hello,\n\nWe have new job opportunities that match your skills and experience. Visit our website to explore the latest listings.\n\nBest regards,\nThe JobPortal Team"
            }));
        }
    }, [job]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendEmail({
            ...emailData,
            jobTitle: job?.title,
            companyName: job?.company?.name || job?.company
        });
        // Note: We don't clear the form here. The parent component should handle closing the modal, which will reset the state.
    };

    const handleClose = () => {
        setEmailData({ to: '', subject: '', message: '' });
        onOpenChange(false);
    };

    const dialogTitle = job ? 'Send Job Alert Email' : 'Send Bulk Email';
    const dialogDescription = job ? 
        'Send an email notification about this specific job opportunity to potential candidates.' : 
        'Send a bulk email to notify multiple candidates about new opportunities.';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="flex items-start">
                    <div className="flex items-center gap-3">
                        <Mail className="h-6 w-6 text-gray-500" />
                        <DialogTitle className="text-xl font-bold">{dialogTitle}</DialogTitle>
                    </div>
                    <DialogDescription className="mt-2">
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!job && (
                        <div>
                            <Label htmlFor="to">Recipient Email(s) *</Label>
                            <Input
                                id="to"
                                type="email"
                                required
                                value={emailData.to}
                                onChange={(e) => setEmailData(prevData => ({...prevData, to: e.target.value}))}
                                placeholder="job.seekers@example.com (or leave empty for bulk)"
                            />
                        </div>
                    )}
                    
                    <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            value={emailData.subject}
                            onChange={(e) => setEmailData(prevData => ({...prevData, subject: e.target.value}))}
                            placeholder="New Job Opportunities Available"
                        />
                    </div>

                    <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                            id="message"
                            required
                            rows={5}
                            value={emailData.message}
                            onChange={(e) => setEmailData(prevData => ({...prevData, message: e.target.value}))}
                            placeholder="Your email message..."
                            className="min-h-[150px]"
                        />
                    </div>

                    <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Email"}
                            <Send className="ml-2 h-4 w-4" />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EmailModal;