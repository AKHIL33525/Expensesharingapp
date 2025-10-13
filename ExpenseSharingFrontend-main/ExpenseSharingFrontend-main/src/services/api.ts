import { User, Group, Expense, ApiResponse } from '../types';

// Mock API service - replace with actual API calls
const API_BASE_URL = '/api';
const DELAY = 800; // Simulate network delay

// Mock data storage
const mockUsers: User[] = [];
const mockGroups: Group[] = [];
let currentUser: User | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

export const authApi = {
  async register(name: string, email: string, password: string): Promise<ApiResponse<User>> {
    await delay(DELAY);
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    const user: User = {
      id: generateId(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push(user);
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, data: user, message: 'Registration successful' };
  },

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    await delay(DELAY);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    return { success: true, data: user, message: 'Login successful' };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(300);
    currentUser = null;
    localStorage.removeItem('user');
    return { success: true, message: 'Logged out successfully' };
  },

  async getMe(): Promise<ApiResponse<User>> {
    await delay(300);
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return { success: true, data: currentUser, message: 'User fetched' };
    }
    
    return { success: false, message: 'User not authenticated' };
  },
};

export const groupsApi = {
  async getGroups(): Promise<ApiResponse<Group[]>> {
    await delay(DELAY);
    
    if (!currentUser) {
      return { success: false, message: 'User not authenticated' };
    }
    
    const userGroups = mockGroups.filter(group => 
      group.members.some(member => member.id === currentUser!.id)
    );
    
    return { success: true, data: userGroups, message: 'Groups fetched' };
  },

  async createGroup(name: string, description: string, memberEmails: string[]): Promise<ApiResponse<Group>> {
    await delay(DELAY);
    
    if (!currentUser) {
      return { success: false, message: 'User not authenticated' };
    }
    
    const members = [
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        balance: 0,
      }
    ];
    
    // Add invited members (in real app, would send invitations)
    memberEmails.forEach(email => {
      if (email && email !== currentUser!.email) {
        members.push({
          id: generateId(),
          name: email.split('@')[0],
          email,
          balance: 0,
        });
      }
    });
    
    const group: Group = {
      id: generateId(),
      name,
      description,
      members,
      expenses: [],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    
    mockGroups.push(group);
    
    return { success: true, data: group, message: 'Group created successfully' };
  },

  async getGroup(groupId: string): Promise<ApiResponse<Group>> {
    await delay(DELAY);
    
    const group = mockGroups.find(g => g.id === groupId);
    if (!group) {
      return { success: false, message: 'Group not found' };
    }
    
    return { success: true, data: group, message: 'Group fetched' };
  },

  async addExpense(
    groupId: string,
    title: string,
    amount: number,
    paidBy: string,
    splitAmong: string[],
    date: string
  ): Promise<ApiResponse<Expense>> {
    await delay(DELAY);
    
    const group = mockGroups.find(g => g.id === groupId);
    if (!group) {
      return { success: false, message: 'Group not found' };
    }
    
    const paidByMember = group.members.find(m => m.id === paidBy);
    if (!paidByMember) {
      return { success: false, message: 'Invalid payer' };
    }
    
    const expense: Expense = {
      id: generateId(),
      title,
      amount,
      paidBy,
      paidByName: paidByMember.name,
      splitAmong,
      date,
      createdAt: new Date().toISOString(),
    };
    
    group.expenses.push(expense);
    
    // Recalculate balances
    const splitAmount = amount / splitAmong.length;
    
    group.members.forEach(member => {
      if (member.id === paidBy) {
        member.balance += amount - (splitAmong.includes(member.id) ? splitAmount : 0);
      } else if (splitAmong.includes(member.id)) {
        member.balance -= splitAmount;
      }
    });
    
    return { success: true, data: expense, message: 'Expense added successfully' };
  },

  async settleUp(groupId: string): Promise<ApiResponse<null>> {
    await delay(DELAY);
    
    const group = mockGroups.find(g => g.id === groupId);
    if (!group) {
      return { success: false, message: 'Group not found' };
    }
    
    // Reset all balances to 0
    group.members.forEach(member => {
      member.balance = 0;
    });
    
    return { success: true, message: 'Balances settled successfully' };
  },
};