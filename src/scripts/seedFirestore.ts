// Run this script once to seed Firestore with initial data.
// After seeding, you can delete this file or keep it for reference.

import { mockReports, mockSpending } from '../data/mockData';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const seedData = async () => {
  try {
    console.log('Seeding reports...');
    for (const report of mockReports) {
      await setDoc(doc(db, 'reports', report.id), report);
    }
    
    console.log('Seeding spending...');
    for (const spending of mockSpending) {
      await setDoc(doc(db, 'spending', spending.id), spending);
    }
    
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
