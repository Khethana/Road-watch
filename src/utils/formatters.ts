export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatLakhs = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')} Lakhs`;
};

export const formatNumber = (n: number): string => {
  return n.toLocaleString('en-IN');
};

export const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-danger/10 text-danger border-danger/20';
    case 'moderate':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'low':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-surface text-text-primary border-border';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-danger/10 text-danger border-danger/20';
    case 'in_progress':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'resolved':
      return 'bg-success/10 text-success border-success/20';
    case 'completed':
      return 'bg-success/10 text-success border-success/20';
    case 'ongoing':
      return 'bg-info/10 text-info border-info/20';
    case 'delayed':
      return 'bg-danger/10 text-danger border-danger/20';
    default:
      return 'bg-surface text-text-primary border-border';
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
