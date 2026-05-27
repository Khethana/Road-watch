import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReportsThunk, updateStatusThunk } from '../store/slices/reportSlice';
import { pageVariants } from '../utils/animations';
import { Report } from '../types';
import { formatDate } from '../utils/formatters';

import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';

export const AdminPanel = () => {
  const dispatch = useAppDispatch();
  const { reports, isLoading } = useAppSelector(state => state.reports);
  
  const [sortField, setSortField] = useState<keyof Report>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchReportsThunk({}));
  }, [dispatch]);

  const handleSort = (field: keyof Report) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new field
    }
  };

  const handleStatusChange = async (id: string, newStatus: Report['status']) => {
    setUpdatingId(id);
    try {
      await dispatch(updateStatusThunk({ id, status: newStatus })).unwrap();
      toast.success(`Admin action: Report #${id.substring(0, 8)} status changed to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: keyof Report }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} className="ml-1 inline" /> : <ChevronDown size={16} className="ml-1 inline" />;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 text-primary rounded-lg mr-3 border border-primary/20">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Admin Control Panel</h1>
            <p className="text-text-secondary">Manage and update civic reports</p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full pl-10 pr-4 py-2 bg-elevated border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors ml-4 px-3 py-2 border border-border rounded-lg hover:bg-elevated">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4"><SkeletonLoader variant="table" /></div>
          ) : sortedReports.length === 0 ? (
            <EmptyState icon={Shield} title="No reports to manage" description="There are currently no active reports in the system." />
          ) : (
            <table className="w-full text-left text-sm" role="table">
              <thead className="bg-elevated/50 text-text-secondary uppercase text-xs border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('id')} aria-sort={sortField === 'id' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    ID <SortIcon field="id" />
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('title')} aria-sort={sortField === 'title' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    Report Details <SortIcon field="title" />
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('area')} aria-sort={sortField === 'area' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    Location <SortIcon field="area" />
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('createdAt')} aria-sort={sortField === 'createdAt' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    Date <SortIcon field="createdAt" />
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium cursor-pointer hover:text-text-primary transition-colors" onClick={() => handleSort('severity')} aria-sort={sortField === 'severity' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    Severity <SortIcon field="severity" />
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-elevated/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-text-muted">
                      {report.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary line-clamp-1 max-w-[200px]">{report.title}</div>
                      <div className="text-text-muted text-xs mt-1">by {report.reporter}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text-primary">{report.area || report.city}</div>
                      <div className="text-text-muted text-xs mt-1">{report.city}, {report.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={report.severity}>{report.severity}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value as Report['status'])}
                        disabled={updatingId === report.id}
                        className={`text-xs font-medium rounded-lg px-3 py-1.5 border focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer ${
                          report.status === 'resolved' ? 'bg-success/10 text-success border-success/20' :
                          report.status === 'in_progress' ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-danger/10 text-danger border-danger/20'
                        } ${updatingId === report.id ? 'opacity-50 cursor-wait' : ''}`}
                        aria-label={`Change status for report ${report.id}`}
                      >
                        <option value="pending" className="text-text-primary bg-surface">Pending</option>
                        <option value="in_progress" className="text-text-primary bg-surface">In Progress</option>
                        <option value="resolved" className="text-text-primary bg-surface">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default AdminPanel;
