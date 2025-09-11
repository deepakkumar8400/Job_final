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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, PlusCircle } from 'lucide-react';

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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className='container mx-auto py-12'>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Job Listings
            </CardTitle>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => openEmailModal(null)}
                disabled={loading}
              >
                <Mail className="mr-2 h-4 w-4" />
                {loading ? 'Sending...' : 'Send Bulk Email'}
              </Button>
              <Button onClick={() => navigate("/admin/jobs/create")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Job
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='mb-6'>
              <Input
                className="w-full md:w-96"
                placeholder="Filter jobs by title, company, or role"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            
            <AdminJobsTable onSendEmail={openEmailModal} />
          </CardContent>
        </Card>

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