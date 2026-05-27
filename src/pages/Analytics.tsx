import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { spendingService } from '../services/spendingService';
import { StatsData, SpendingRecord } from '../types';
import { mockTrendData, mockCityData, mockResolutionData, mockSpending } from '../data/mockData';
import { pageVariants } from '../utils/animations';

import Card from '../components/ui/Card';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import ErrorState from '../components/ui/ErrorState';
import ComplaintTrendChart from '../components/charts/ComplaintTrendChart';
import BudgetChart from '../components/charts/BudgetChart';
import ResolutionRateChart from '../components/charts/ResolutionRateChart';
import AreaDamageChart from '../components/charts/AreaDamageChart';

export const Analytics = () => {
  const [spending, setSpending] = useState<SpendingRecord[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [spendingData, statsData] = await Promise.all([
        spendingService.getAll(),
        spendingService.getSummary()
      ]);
      setSpending(spendingData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState title="Analytics Error" description={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6 pb-10"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary">City Analytics</h1>
        <p className="text-text-secondary">Deep dive into civic data and spending</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-text-primary">Complaint Trends (Yearly)</h3>
            <p className="text-sm text-text-muted">Reported vs Resolved issues over time</p>
          </Card.Header>
          <Card.Body>
            {isLoading ? <SkeletonLoader variant="chart" /> : <ComplaintTrendChart data={mockTrendData} />}
          </Card.Body>
        </Card>

        {/* Budget Chart */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-text-primary">Budget Utilization</h3>
            <p className="text-sm text-text-muted">Allocated vs Spent funds per month (in Lakhs)</p>
          </Card.Header>
          <Card.Body>
            {isLoading ? <SkeletonLoader variant="chart" /> : <BudgetChart data={spending.length > 0 ? spending : mockSpending} />}
          </Card.Body>
        </Card>

        {/* City Damage Chart */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-text-primary">Issues by City</h3>
            <p className="text-sm text-text-muted">Distribution of reports across major cities</p>
          </Card.Header>
          <Card.Body>
            {isLoading ? <SkeletonLoader variant="chart" /> : <AreaDamageChart data={mockCityData} />}
          </Card.Body>
        </Card>

        {/* Resolution Rate Chart */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-text-primary">Resolution Rate</h3>
            <p className="text-sm text-text-muted">Percentage of issues fixed within SLA (24 Weeks)</p>
          </Card.Header>
          <Card.Body>
            {isLoading ? <SkeletonLoader variant="chart" /> : <ResolutionRateChart data={mockResolutionData} />}
          </Card.Body>
        </Card>
      </div>
      
      {/* Key Insights Summary */}
      {!isLoading && stats && (
        <Card className="bg-primary/5 border-primary/20">
          <Card.Body>
            <h3 className="font-semibold text-lg text-primary mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-sm text-text-secondary block">Average Resolution Time</span>
                <span className="text-2xl font-bold text-text-primary">{stats.avgResolutionDays} Days</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-text-secondary block">Budget Efficiency</span>
                <span className="text-2xl font-bold text-text-primary">{stats.budgetUtilized}% Utilized</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-text-secondary block">Active Contractors</span>
                <span className="text-2xl font-bold text-text-primary">{stats.activeContractors} Teams</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </motion.div>
  );
};

export default Analytics;
