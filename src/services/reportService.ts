import { db, storage, auth } from '../config/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Report, FilterState, ReportFormData, PaginatedResponse } from '../types';
import { ENV } from '../config/env';
import { compressImage } from '../utils/imageCompressor';

export const reportService = {
  getAll: async (filters?: Partial<FilterState>, page: number = 1, limit: number = ENV.PAGE_SIZE): Promise<PaginatedResponse<Report>> => {
    const reportsRef = collection(db, 'reports');
    let q = query(reportsRef, orderBy('createdAt', 'desc'));
    
    if (filters) {
      if (filters.severity && filters.severity.length > 0) {
        q = query(q, where('severity', 'in', filters.severity));
      }
      if (filters.status && filters.status.length > 0) {
        q = query(q, where('status', 'in', filters.status));
      }
      if (filters.area) {
        q = query(q, where('area', '==', filters.area));
      }
    }
    
    const snapshot = await getDocs(q);
    const allReports = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Report));
    
    const start = (page - 1) * limit;
    const paginatedData = allReports.slice(start, start + limit);
    
    return {
      data: paginatedData,
      total: allReports.length,
      page,
      limit,
      totalPages: Math.ceil(allReports.length / limit)
    };
  },

  create: async (data: ReportFormData): Promise<Report> => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('You must be logged in to report an issue');
    
    let imageUrl = '';
    if (data.image instanceof File) {
      try {
        // Compress the image to a low-res Base64 string to bypass Firebase Storage
        // and fit perfectly inside the 1MB Firestore document limit!
        imageUrl = await compressImage(data.image);
      } catch (error) {
        console.error("Image compression failed", error);
        imageUrl = data.image.name; // Fallback to just the name if compression fails
      }
    }
    
    const now = new Date().toISOString();
    
    const reportData: Omit<Report, 'id'> = {
      title: data.title || '',
      description: data.description || '',
      severity: data.severity,
      status: 'pending',
      state: data.state || '',
      city: data.city || '',
      area: data.area || '',
      lat: data.lat || ENV.MAP_DEFAULT_LAT,
      lng: data.lng || ENV.MAP_DEFAULT_LNG,
      date: now,
      reporter: currentUser.displayName || 'Citizen',
      reporterId: currentUser.uid,
      image: imageUrl,
      upvotes: 0,
      ward: 'Unassigned',
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, 'reports'), reportData as any);
    
    return { ...reportData, id: docRef.id } as Report;
  },

  updateStatus: async (id: string, status: Report['status']): Promise<Report> => {
    const reportRef = doc(db, 'reports', id);
    const now = new Date().toISOString();
    
    await updateDoc(reportRef, {
      status,
      updatedAt: now
    });
    
    const updatedDoc = await getDoc(reportRef);
    return { ...updatedDoc.data(), id: updatedDoc.id } as Report;
  }
};
