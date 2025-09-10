import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EmailModal = ({ open, onOpenChange, job, onSendEmail }) => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendEmail({
      ...emailData,
      jobTitle: job?.title,
      companyName: job?.company?.name || job?.company
    });
    setEmailData({ to: '', subject: '', message: '' });
  };

  const handleClose = () => {
    setEmailData({ to: '', subject: '', message: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Job Alert Email</DialogTitle>
          <DialogDescription>
            Send an email notification about this job opportunity to potential candidates.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="to">Recipient Email *</Label>
            <Input
              id="to"
              type="email"
              required
              value={emailData.to}
              onChange={(e) => setEmailData({...emailData, to: e.target.value})}
              placeholder="job.seeker@example.com"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              placeholder={job ? `Job Opportunity: ${job.title} at ${job.company?.name || job.company}` : 'New Job Opportunities Available'}
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <textarea
              id="message"
              required
              rows={5}
              value={emailData.message}
              onChange={(e) => setEmailData({...emailData, message: e.target.value})}
              placeholder={
                job 
                  ? `We have an exciting opportunity for ${job.title} at ${job.company?.name || job.company}. This role requires...`
                  : 'We have multiple new job opportunities that match your skills and experience...'
              }
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Send Email</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;