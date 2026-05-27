import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../../types';

const initialState: FilterState = {
  severity: [],
  status: [],
  area: '',
  dateRange: null,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSeverityFilter: (state, action: PayloadAction<string[]>) => {
      state.severity = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string[]>) => {
      state.status = action.payload;
    },
    setAreaFilter: (state, action: PayloadAction<string>) => {
      state.area = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ from: string; to: string } | null>) => {
      state.dateRange = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setSeverityFilter, setStatusFilter, setAreaFilter, setDateRange, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
