import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button'; 
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux'; 
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import EmailModal from "./EmailModal";
import useSendEmail from '@/hooks/useSendEmail';
import { toast } from 'react-hot-toast';

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sendEmail, loading } = useSendEmail();

  const jobs = useSelector((state) => state.job.adminJobs);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  const handleSendEmail = async (emailData) => {
    const result = await sendEmail(emailData);
    if (result.success) {
      toast.success('Email sent successfully!');
    } else {
      toast.error(result.error || 'Failed to send email');
    }
  };

  const openEmailModal = (job) => {
    setSelectedJob(job);
    setEmailModalOpen(true);
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-80"
            placeholder="Filter jobs by title, company, or role"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => openEmailModal(null)}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Bulk Email'}
            </Button>
            <Button onClick={() => navigate("/admin/jobs/create")}>
              + New Job
            </Button>
          </div>
        </div>
        
        <AdminJobsTable onSendEmail={openEmailModal} />

        <EmailModal
          open={emailModalOpen}
          onOpenChange={setEmailModalOpen}
          job={selectedJob}
          onSendEmail={handleSendEmail}
        />
      </div>
    </div>
  );
};

export default AdminJobs;