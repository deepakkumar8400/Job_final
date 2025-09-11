import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Trash2, Building2, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { toast } from 'react-hot-toast'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import axios from 'axios'

const CompaniesTable = () => {
    const { companies, searchCompanyByText, isLoading } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const refreshCompanies = useGetAllCompanies();

    useEffect(() => {
        const filteredCompany = companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    const handleDeleteClick = (company, e) => {
        e.stopPropagation();
        setCompanyToDelete(company);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (companyToDelete) {
            setIsDeleting(true);
            try {
                console.log('Attempting to delete company:', companyToDelete._id);
                
                // Use withCredentials: true to send cookies automatically
                const response = await axios.delete(
                    `http://localhost:8000/api/v1/company/delete/${companyToDelete._id}`,
                    {
                        withCredentials: true // This sends cookies automatically
                    }
                );
                
                console.log('Delete response:', response.data);
                
                if (response.data.success) {
                    toast.success('Company deleted successfully');
                    // Refresh the companies list
                    refreshCompanies();
                } else {
                    toast.error(response.data.message || 'Failed to delete company');
                }
            } catch (error) {
                console.error('Delete company error details:', error);
                console.error('Error response:', error.response?.data);
                
                if (error.response?.status === 401) {
                    toast.error('Authentication failed. Please log in again.');
                    navigate('/login');
                } else if (error.response?.status === 500) {
                    toast.error('Server error. Please check if you have permission to delete this company.');
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Failed to delete company. Please try again.');
                }
            } finally {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setCompanyToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
    };

    const handleEditClick = (companyId, e) => {
        e.stopPropagation();
        navigate(`/admin/companies/${companyId}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        );
    }

    if (filterCompany.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No companies found</h3>
                <p className="text-gray-500 mt-2">
                    {searchCompanyByText 
                        ? `No results for "${searchCompanyByText}"` 
                        : "Get started by creating your first company."
                    }
                </p>
            </div>
        );
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.map((company) => (
                        <TableRow key={company._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/companies/${company._id}`)}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage 
                                        src={company.logo} 
                                        alt={company.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback>
                                        <Building2 className="h-5 w-5 text-gray-400" />
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {company.industry || 'Not specified'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {company.size ? `${company.size} employees` : 'Not specified'}
                                </span>
                            </TableCell>
                            <TableCell>
                                {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-40 p-2" align="end">
                                        <div className="flex flex-col space-y-1">
                                            <div 
                                                onClick={(e) => handleEditClick(company._id, e)} 
                                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span className="text-sm">Edit</span>
                                            </div>
                                            <div 
                                                onClick={(e) => handleDeleteClick(company, e)} 
                                                className="flex items-center gap-2 p-2 rounded-md hover:bg-red-50 text-red-600 cursor-pointer"
                                            >
                                                <Trash2 className='w-4 h-4' />
                                                <span className="text-sm">Delete</span>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the company
                            "{companyToDelete?.name}" and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Company'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default CompaniesTable