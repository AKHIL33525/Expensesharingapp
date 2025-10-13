import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Group } from '../types';
import { groupsApi } from '../services/api';
import { Plus, Users, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupsApi.getGroups();
      if (response.success && response.data) {
        setGroups(response.data);
      } else {
        showToast(response.message, 'error');
      }
    } catch (error) {
      showToast('Failed to fetch groups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTotalBalance = () => {
    return groups.reduce((total, group) => {
      const userMember = group.members.find(m => m.id === user?.id);
      return total + (userMember?.balance || 0);
    }, 0);
  };

  const getRecentActivity = () => {
    const allExpenses = groups.flatMap(group => 
      group.expenses.map(expense => ({
        ...expense,
        groupName: group.name,
        groupId: group.id,
      }))
    );
    return allExpenses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalBalance = getTotalBalance();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your shared expenses and settle up with friends</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Groups</p>
                <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <TrendingUp className={`w-6 h-6 ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Balance</p>
                <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(totalBalance).toFixed(2)}
                  {totalBalance < 0 && ' owed'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{recentActivity.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Groups Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
                <Link
                  to="/create-group"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Link>
              </div>
            </div>

            <div className="p-6">
              {groups.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
                  <p className="text-gray-500 mb-4">Create your first group to start sharing expenses</p>
                  <Link
                    to="/create-group"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Group
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {groups.map((group) => {
                    const userMember = group.members.find(m => m.id === user?.id);
                    const balance = userMember?.balance || 0;
                    
                    return (
                      <Link
                        key={group.id}
                        to={`/group/${group.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{group.name}</h3>
                            <p className="text-sm text-gray-500">{group.members.length} members</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Created {format(new Date(group.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {group.expenses.length} expenses
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>

            <div className="p-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-500">Start adding expenses to see activity here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{expense.title}</h4>
                        <p className="text-sm text-gray-500">
                          in {expense.groupName} • paid by {expense.paidByName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(expense.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          split {expense.splitAmong.length} ways
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;