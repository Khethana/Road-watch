import React from 'react';
import { MapPin, Calendar, ThumbsUp, User } from 'lucide-react';
import { Report } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { formatDate, formatRelativeTime } from '../utils/formatters';

interface ReportCardProps {
  report: Report;
  onClick?: (report: Report) => void;
  onUpvote?: (id: string) => void;
}

export const ReportCard = React.memo(({ report, onClick, onUpvote }: ReportCardProps) => {
  return (
    <Card 
      hoverable 
      className="h-full flex flex-col cursor-pointer outline-none focus-within:ring-2 focus-within:ring-primary"
      onClick={() => onClick && onClick(report)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(report);
        }
      }}
    >
      <div className="relative h-48 w-full bg-elevated border-b border-border overflow-hidden flex items-center justify-center">
        {report.image && (report.image.startsWith('http') || report.image.startsWith('data:')) ? (
          <img 
            src={report.image} 
            alt={`Issue: ${report.title}`} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : report.image ? (
          <div className="flex flex-col items-center justify-center text-text-muted p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span className="text-sm text-center break-all line-clamp-2">Attached: {report.image}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-text-muted p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            <span className="text-sm">No Photo</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex space-x-2">
          <Badge variant={report.severity}>{report.severity}</Badge>
          <Badge variant={report.status}>{report.status.replace('_', ' ')}</Badge>
        </div>
      </div>
      
      <Card.Body className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-text-primary line-clamp-1 mb-2">
          {report.title}
        </h3>
        
        <p className="text-text-secondary text-sm line-clamp-2 mb-4 flex-1">
          {report.description}
        </p>
        
        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-xs text-text-muted">
            <MapPin size={14} className="mr-1.5 shrink-0" />
            <span className="truncate">{report.area ? `${report.area}, ` : ''}{report.city}</span>
          </div>
          
          <div className="flex items-center text-xs text-text-muted">
            <Calendar size={14} className="mr-1.5 shrink-0" />
            <span>{formatRelativeTime(report.createdAt)}</span>
          </div>
        </div>
      </Card.Body>
      
      <Card.Footer className="flex justify-between items-center py-3 bg-surface">
        <div className="flex items-center text-xs font-medium text-text-secondary">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2">
            <User size={12} />
          </div>
          <span className="truncate max-w-[100px]">{report.reporter}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={`px-2 py-1 text-xs ${report.upvotes > 0 ? 'text-primary' : 'text-text-muted'}`}
          onClick={(e) => {
            e.stopPropagation();
            onUpvote && onUpvote(report.id);
          }}
          aria-label={`Upvote this report. Current upvotes: ${report.upvotes}`}
        >
          <ThumbsUp size={14} className="mr-1.5" />
          {report.upvotes}
        </Button>
      </Card.Footer>
    </Card>
  );
});

ReportCard.displayName = 'ReportCard';
export default ReportCard;
