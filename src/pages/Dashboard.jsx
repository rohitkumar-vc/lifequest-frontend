import React, { useMemo, useState, useEffect } from 'react';
import { useGame } from '../context/GameProvider';
import { useAuth } from '../context/AuthProvider';
import api from '../api/axios';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { Flame, Repeat, CheckSquare, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Register ChartJS components
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    Title, 
    Tooltip, 
    Legend,
    ArcElement
);

const Dashboard = () => {
    const { user } = useAuth();
    const { tasks } = useGame();
    
    // Analytics State
    const [weeklyData, setWeeklyData] = useState([]);
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
             try {
                 const [weeklyRes, recentRes] = await Promise.all([
                     api.get('/analytics/weekly'),
                     api.get('/analytics/recent')
                 ]);
                 setWeeklyData(weeklyRes.data);
                 setRecentLogs(recentRes.data);
             } catch (error) {
                 console.error("Failed to fetch analytics", error);
             } finally {
                 setLoading(false);
             }
        };
        fetchAnalytics();
    }, [tasks]); // Refresh when tasks change (completion triggers log)

    // Stats
    const habits = tasks.filter(t => t.type === 'habit');
    const dailies = tasks.filter(t => t.type === 'daily');
    const todos = tasks.filter(t => t.type === 'todo');
    
    const completedTodos = todos.filter(t => t.status === 'completed').length;
    const activeTodos = todos.length - completedTodos;

    // --- Graph Data (Real) ---
    
    const distributionData = {
        labels: ['Habits', 'Dailies', 'To-Dos'],
        datasets: [
            {
                data: [habits.length, dailies.length, todos.length],
                backgroundColor: [
                    'rgba(249, 115, 22, 0.6)', 
                    'rgba(59, 130, 246, 0.6)', 
                    'rgba(16, 185, 129, 0.6)', 
                ],
                borderColor: [
                    'rgba(249, 115, 22, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const activityData = {
        labels: weeklyData.map(d => d.day),
        datasets: [
            {
                label: 'XP Gained',
                data: weeklyData.map(d => d.xp_gained),
                backgroundColor: 'rgba(139, 92, 246, 0.5)', 
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#9CA3AF' }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9CA3AF' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF' }
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                        Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.username}</span>
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-400" />
                        System optimal. Ready for adventure.
                    </p>
                </div>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/habits" className="group bg-card-dark border border-white/5 p-6 rounded-2xl hover:border-orange-500/50 transition-all flex items-center justify-between">
                    <div>
                        <div className="p-3 bg-orange-500/10 rounded-lg w-fit mb-3 group-hover:bg-orange-500/20 transition-colors">
                            <Flame className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Habits</h3>
                        <p className="text-sm text-gray-500">{habits.length} Active</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </Link>

                <Link to="/dailies" className="group bg-card-dark border border-white/5 p-6 rounded-2xl hover:border-blue-500/50 transition-all flex items-center justify-between">
                     <div>
                        <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-3 group-hover:bg-blue-500/20 transition-colors">
                            <Repeat className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Dailies</h3>
                         <p className="text-sm text-gray-500">{dailies.length} Active</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </Link>

                <Link to="/todos" className="group bg-card-dark border border-white/5 p-6 rounded-2xl hover:border-green-500/50 transition-all flex items-center justify-between">
                     <div>
                        <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-3 group-hover:bg-green-500/20 transition-colors">
                            <CheckSquare className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white">To-Dos</h3>
                         <p className="text-sm text-gray-500">{activeTodos} Pending</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </Link>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* XP Activity Chart */}
                <div className="lg:col-span-2 bg-card-dark border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                            Weekly Activity
                        </h3>
                    </div>
                    <div className="h-56 md:h-80 w-full relative">
                         <Bar options={chartOptions} data={activityData} />
                    </div>
                </div>

                {/* Task Distribution */}
                <div className="bg-card-dark border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6">Task Breakdown</h3>
                    <div className="h-64 flex items-center justify-center">
                        {tasks.length > 0 ? (
                            <Doughnut 
                                data={distributionData} 
                                options={{
                                    plugins: { legend: { position: 'bottom', labels: { color: '#9CA3AF' } } },
                                    cutout: '70%',
                                    responsive: true
                                }} 
                            />
                        ) : (
                            <div className="text-gray-500 text-sm">No tasks created yet</div>
                        )}
                    </div>
                </div>
            </div>
            
             {/* Recent Logs */}
             <div className="bg-card-dark border border-white/5 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Captain's Log</h3>
                <div className="space-y-3">
                    {recentLogs.slice(0, 6).length > 0 ? recentLogs.slice(0, 6).map(log => (
                        <div key={log.id} className="flex items-center gap-3 text-sm text-gray-400 p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <span className={`w-2 h-2 rounded-full ${log.xp_change > 0 ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                            <span>{log.message}</span>
                            <span className="ml-auto text-xs opacity-50">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                        </div>
                    )) : (
                        <div className="text-gray-500 text-sm italic">No recent activity recorded.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
