import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReportsThunk } from '../store/slices/reportSlice';
import { openModal } from '../store/slices/uiSlice';
import { pageVariants, cardVariants } from '../utils/animations';

import StatsWidget from '../components/ui/StatsWidget';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import ReportCard from '../components/ReportCard';
import MapView from '../components/map/MapView';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { reports, isLoading, error } = useAppSelector(state => state.reports);
  const filters = useAppSelector(state => state.filters);
  const { activeModal, modalData } = useAppSelector(state => state.ui);

  useEffect(() => {
    dispatch(fetchReportsThunk({ filters }));
  }, [dispatch, filters]);

  // Derived stats
  const stats = useMemo(() => {
    if (!reports.length) return null;
    const critical = reports.filter(r => r.severity === 'critical').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const pending = reports.filter(r => r.status === 'pending').length;
    
    return {
      total: reports.length,
      critical,
      resolved,
      pending
    };
  }, [reports]);

  const handleReportClick = (report: any) => {
    dispatch(openModal({ name: 'reportDetails', data: report }));
  };

  const handleModalClose = () => {
    dispatch(openModal({ name: '' }));
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState onRetry={() => dispatch(fetchReportsThunk({ filters }))} />
      </div>
    );
  }

  const selectedReport = modalData as any;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Overview of city road conditions</p>
        </div>
      </div>

      {/* Stats Row */}
      {isLoading && !reports.length ? (
        <SkeletonLoader variant="stat" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsWidget 
            title="Total Reports" 
            value={stats?.total || 0} 
            icon={MapPin} 
            iconColor="text-primary"
            isLoading={isLoading}
          />
          <StatsWidget 
            title="Critical Issues" 
            value={stats?.critical || 0} 
            icon={AlertTriangle} 
            iconColor="text-danger"
            isLoading={isLoading}
          />
          <StatsWidget 
            title="Resolved" 
            value={stats?.resolved || 0} 
            icon={CheckCircle} 
            iconColor="text-success"
            isLoading={isLoading}
          />
          <StatsWidget 
            title="Pending Actions" 
            value={stats?.pending || 0} 
            icon={Clock} 
            iconColor="text-warning"
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Live Map</h2>
            <div className="text-sm text-text-muted" aria-live="polite">
              Showing {reports.length} reports
            </div>
          </div>
          {isLoading && !reports.length ? (
            <SkeletonLoader variant="chart" />
          ) : (
            <MapView 
              reports={reports} 
              height="500px" 
              onMarkerClick={handleReportClick} 
            />
          )}
        </div>

        {/* Recent Reports List */}
        <div className="space-y-4 flex flex-col h-[544px]"> {/* matching map height + header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Recent Reports</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface border border-border rounded-xl p-4">
            {isLoading && !reports.length ? (
              <SkeletonLoader variant="list" />
            ) : reports.length === 0 ? (
              <EmptyState 
                icon={MapPin} 
                title="No reports found" 
                description="Try adjusting your filters or be the first to report in this area." 
              />
            ) : (
              <div className="space-y-4" role="list">
                {reports.map((report, i) => (
                  <motion.div
                    key={report.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    role="listitem"
                  >
                    <ReportCard 
                      report={report} 
                      onClick={handleReportClick} 
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={activeModal === 'reportDetails'}
        onClose={handleModalClose}
        title="Report Details"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3 w-full">
            <Button variant="outline" onClick={handleModalClose}>Close</Button>
          </div>
        }
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{selectedReport.title}</h3>
                <div className="flex space-x-2">
                  <Badge variant={selectedReport.severity}>{selectedReport.severity}</Badge>
                  <Badge variant={selectedReport.status}>{selectedReport.status.replace('_', ' ')}</Badge>
                </div>
              </div>
              <div className="text-right text-sm text-text-secondary">
                <div>Reported by: <span className="font-medium text-text-primary">{selectedReport.reporter}</span></div>
                <div>{formatDate(selectedReport.createdAt)}</div>
              </div>
            </div>
            
            <div className="w-full h-64 rounded-xl overflow-hidden bg-elevated border border-border">
              <img src={selectedReport.image} alt={selectedReport.title} className="w-full h-full object-cover" />
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Description</h4>
              <p className="text-text-secondary leading-relaxed bg-elevated/30 p-4 rounded-lg">
                {selectedReport.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border p-3 rounded-lg">
                <span className="text-sm text-text-muted block">Location</span>
                <span className="font-medium text-text-primary">{selectedReport.area ? `${selectedReport.area}, ` : ''}{selectedReport.city}, {selectedReport.state}</span>
              </div>
              <div className="bg-surface border border-border p-3 rounded-lg">
                <span className="text-sm text-text-muted block">Coordinates</span>
                <span className="font-medium text-text-primary">{selectedReport.lat.toFixed(4)}, {selectedReport.lng.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Dashboard;
