export interface Report {
  id: string
  title: string
  description: string
  severity: 'critical' | 'moderate' | 'low'
  status: 'pending' | 'in_progress' | 'resolved'
  state: string
  city: string
  area: string
  lat: number
  lng: number
  date: string
  reporter: string
  reporterId: string
  image: string
  upvotes: number
  ward: string
  createdAt: string
  updatedAt: string
}

export interface SpendingRecord {
  id: string
  month: string
  allocated: number
  spent: number
  contractor: string
  area: string
  project: string
  status: 'completed' | 'ongoing' | 'delayed'
}

export interface User {
  id: string
  name: string
  email: string
  role: 'citizen' | 'admin'
  avatar: string
  ward: string
  joinedDate: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface StatsData {
  totalComplaints: number
  roadsRepaired: number
  pendingIssues: number
  budgetUtilized: number
  avgResolutionDays: number
  activeContractors: number
}

export interface FilterState {
  severity: string[]
  status: string[]
  area: string
  dateRange: { from: string; to: string } | null
}

export interface ReportFormData {
  title: string
  description: string
  severity: 'critical' | 'moderate' | 'low'
  state: string
  city: string
  area: string
  lat: number | null
  lng: number | null
  image: File | null
}

export interface Contractor {
  id: string
  name: string
  activeProjects: number
  completionRate: number
  currentArea: string
  rating: number
}

export interface ChartDataPoint {
  name: string
  value?: number
  reported?: number
  resolved?: number
  [key: string]: string | number | undefined
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
