import { useQuery } from '@tanstack/react-query';
import { expensesAPI, revenuesAPI, teamsAPI, seasonsAPI } from '../services/api';
import { TrendingDown, TrendingUp, Users, Calendar, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Activity {
    id: string;
    type: 'expense' | 'revenue' | 'team' | 'season';
    description: string;
    amount?: number;
    timestamp: string;
    icon: React.ReactNode;
    color: string;
}

export default function RecentActivity() {
    const { data: expenses = [] } = useQuery({
          queryKey: ['expenses'],
          queryFn: expensesAPI.getAll,
    });

  const { data: revenues = [] } = useQuery({
        queryKey: ['revenues'],
        queryFn: revenuesAPI.getAll,
  });

  const { data: teams = [] } = useQuery({
        queryKey: ['teams'],
        queryFn: teamsAPI.getAll,
  });

  const { data: seasons = [] } = useQuery({
        queryKey: ['seasons'],
        queryFn: seasonsAPI.getAll,
  });

  // Combine all activities and sort by date (most recent first)
  const activities: Activity[] = [
        ...expenses.map((e) => ({
                id: e.id,
                type: 'expense' as const,
                description: `Expense: ${e.description}`,
                amount: e.amount,
                timestamp: e.created_at,
                icon: <TrendingDown className="w-4 h-4" />,
                color: 'text-red-400',
        })),
        ...revenues.map((r) => ({
                id: r.id,
                type: 'revenue' as const,
                description: `Revenue: ${r.description}`,
                amount: r.amount,
                timestamp: r.created_at,
                icon: <TrendingUp className="w-4 h-4" />,
                color: 'text-green-400',
        })),
        ...teams.map((t) => ({
                id: t.id,
                type: 'team' as const,
                description: `Team created: ${t.name}`,
                timestamp: t.created_at,
                icon: <Users className="w-4 h-4" />,
                color: 'text-blue-400',
        })),
        ...seasons.map((s) => ({
                id: s.id,
                type: 'season' as const,
                description: `Season created: ${s.name}`,
                timestamp: s.created_at,
                icon: <Calendar className="w-4 h-4" />,
                color: 'text-purple-400',
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 10);

  if (activities.length === 0) {
        return (
                <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>h3>
                        <p className="text-text-secondary text-sm">No activity yet. Create a budget to get started!</p>p>
                </div>div>
              );
  }
  
    return (
          <div className="bg-bg-secondary rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>h3>
                <div className="space-y-3">
                  {activities.map((activity) => (
                      <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 p-3 bg-bg-primary rounded-lg hover:bg-white/5 transition-colors">
                                  <div className={`${activity.color} mt-0.5`}>{activity.icon}</div>div>
                                  <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{activity.description}</p>p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                                <Clock className="w-3 h-3 text-text-secondary" />
                                                                <p className="text-text-secondary text-xs">
                                                                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                                </p>p>
                                                </div>div>
                                  </div>div>
                        {activity.amount !== undefined && (
                                      <div className={`text-right ${activity.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                                                      <p className="text-sm font-semibold">
                                                        {activity.type === 'expense' ? '-' : '+'}${activity.amount.toLocaleString()}
                                                      </p>p>
                                      </div>div>
                                  )}
                      </div>div>
                    ))}
                </div>div>
          </div>div>
        );
}</div>
