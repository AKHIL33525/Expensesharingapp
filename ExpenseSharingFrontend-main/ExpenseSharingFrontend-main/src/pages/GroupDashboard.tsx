import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Group, Expense } from '../types';
import { groupsApi } from '../services/api';
import { Plus, ArrowLeft, Users, DollarSign, Calendar, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';

const GroupDashboard: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    paidBy: '',
    splitAmong: [] as string[],
    date: new Date().toISOString().split('T')[0],
  });
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [settleLoading, setSettleLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  const fetchGroup = async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const response = await groupsApi.getGroup(groupId);
      if (response.success && response.data) {
        setGroup(response.data);
        setExpenseForm(prev => ({
          ...prev,
          paidBy: user?.id || '',
          splitAmong: response.data.members.map(m => m.id),
        }));
      } else {
        showToast(response.message, 'error');
        navigate('/dashboard');
      }
    } catch (error) {
      showToast('Failed to fetch group details', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!group || !expenseForm.title || !expenseForm.amount || !expenseForm.paidBy || expenseForm.splitAmong.length === 0) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      setExpenseLoading(true);
      const response = await groupsApi.addExpense(
        group.id,
        expenseForm.title,
        parseFloat(expenseForm.amount),
        expenseForm.paidBy,
        expenseForm.splitAmong,
        expenseForm.date
      );
      
      if (response.success) {
        showToast('Expense added successfully!', 'success');
        setShowAddExpense(false);
        setExpenseForm({
          title: '',
          amount: '',
          paidBy: user?.id || '',
          splitAmong: group.members.map(m => m.id),
          date: new Date().toISOString().split('T')[0],
        });
        await fetchGroup(); // Refresh group data
      } else {
        showToast(response.message, 'error');
      }
    } catch (error) {
      showToast('Failed to add expense', 'error');
    } finally {
      setExpenseLoading(false);
    }
  };

  const handleSettleUp = async () => {
    if (!group) return;

    try {
      setSettleLoading(true);
      const response = await groupsApi.settleUp(group.id);
      if (response.success) {
        showToast('Balances settled successfully!', 'success');
        await fetchGroup();
      } else {
        showToast(response.message, 'error');
      }
    } catch (error) {
      showToast('Failed to settle balances', 'error');
    } finally {
      setSettleLoading(false);
    }
  };

  const toggleMemberInSplit = (memberId: string) => {
    setExpenseForm(prev => ({
      ...prev,
      splitAmong: prev.splitAmong.includes(memberId)
        ? prev.splitAmong.filter(id => id !== memberId)
        : [...prev.splitAmong, memberId],
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!group) {
    return null;
  }

  const userMember = group.members.find(m => m.id === user?.id);
  const isOwner = group.createdBy === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
              <p className="text-gray-600 mb-4">{group.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAddExpense(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </button>
              <button
                onClick={handleSettleUp}
                disabled={settleLoading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
              >
                {settleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Settling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Settle Up
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {group.members.map((member) => (
            <div key={member.id} className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border ${
              member.id === user?.id ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {member.name} {member.id === user?.id && '(You)'}
                  </h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${member.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {member.balance >= 0 ? '+' : ''}${member.balance.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {member.balance >= 0 ? 'gets back' : 'owes'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expenses List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
          </div>

          <div className="p-6">
            {group.expenses.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first expense</p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {group.expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{expense.title}</h4>
                      <p className="text-sm text-gray-500">
                        Paid by {expense.paidByName} • Split among {expense.splitAmong.length} members
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        ${(expense.amount / expense.splitAmong.length).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Expense</h2>
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-6">
              <div>
                <label htmlFor="expense-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  id="expense-title"
                  type="text"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dinner at restaurant"
                  required
                />
              </div>

              <div>
                <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label htmlFor="expense-paidby" className="block text-sm font-medium text-gray-700 mb-1">
                  Paid By
                </label>
                <select
                  id="expense-paidby"
                  value={expenseForm.paidBy}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, paidBy: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select who paid</option>
                  {group.members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} {member.id === user?.id && '(You)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Split Among
                </label>
                <div className="space-y-2">
                  {group.members.map((member) => (
                    <label key={member.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={expenseForm.splitAmong.includes(member.id)}
                        onChange={() => toggleMemberInSplit(member.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {member.name} {member.id === user?.id && '(You)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  id="expense-date"
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expenseLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {expenseLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    'Add Expense'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDashboard;