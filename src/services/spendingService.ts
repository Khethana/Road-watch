import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { SpendingRecord, StatsData } from '../types';

export const spendingService = {
  getAll: async (): Promise<SpendingRecord[]> => {
    const snapshot = await getDocs(collection(db, 'spending'));
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SpendingRecord));
  },

  getSummary: async (): Promise<StatsData> => {
    const reportsSnap = await getDocs(collection(db, 'reports'));
    const spendingSnap = await getDocs(collection(db, 'spending'));
    
    let totalComplaints = 0;
    let roadsRepaired = 0;
    let pendingIssues = 0;
    
    reportsSnap.forEach(doc => {
      totalComplaints++;
      const data = doc.data() as any;
      if (data.status === 'resolved') roadsRepaired++;
      if (data.status === 'pending') pendingIssues++;
    });
    
    let totalAllocated = 0;
    let totalSpent = 0;
    const contractors = new Set<string>();
    
    spendingSnap.forEach(doc => {
      const data = doc.data() as any;
      totalAllocated += data.allocated || 0;
      totalSpent += data.spent || 0;
      if (data.contractor) contractors.add(data.contractor);
    });
    
    const budgetUtilized = totalAllocated > 0 
      ? Math.round((totalSpent / totalAllocated) * 1000) / 10 
      : 0;
      
    return {
      totalComplaints,
      roadsRepaired,
      pendingIssues,
      budgetUtilized,
      avgResolutionDays: 7,
      activeContractors: contractors.size
    };
  },

  getByArea: async (area: string): Promise<SpendingRecord[]> => {
    const q = query(collection(db, 'spending'), where('area', '==', area));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SpendingRecord));
  }
};
