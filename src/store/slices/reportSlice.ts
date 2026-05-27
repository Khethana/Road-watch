import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Report, FilterState, ReportFormData } from '../../types';
import { reportService } from '../../services/reportService';
import toast from 'react-hot-toast';

interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  isLoading: boolean;
  error: string | null;
  pagination: { page: number; total: number; totalPages: number };
}

const initialState: ReportState = {
  reports: [],
  selectedReport: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, total: 0, totalPages: 1 },
};

export const fetchReportsThunk = createAsyncThunk(
  'reports/fetchAll',
  async ({ filters, page }: { filters?: Partial<FilterState>; page?: number }, { rejectWithValue }) => {
    try {
      return await reportService.getAll(filters, page);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reports');
    }
  }
);

export const createReportThunk = createAsyncThunk(
  'reports/create',
  async (formData: ReportFormData, { rejectWithValue }) => {
    try {
      return await reportService.create(formData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit report');
    }
  }
);

export const updateStatusThunk = createAsyncThunk(
  'reports/updateStatus',
  async ({ id, status }: { id: string; status: Report['status'] }, { rejectWithValue }) => {
    try {
      return await reportService.updateStatus(id, status);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReportsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchReportsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createReportThunk.fulfilled, (state, action) => {
        state.reports.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(updateStatusThunk.fulfilled, (state, action) => {
        const index = state.reports.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        if (state.selectedReport?.id === action.payload.id) {
          state.selectedReport = action.payload;
        }
      });
  },
});

export const { setSelectedReport, clearError } = reportSlice.actions;
export default reportSlice.reducer;
