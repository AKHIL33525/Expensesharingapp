export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  expenses: Expense[];
  createdBy: string;
  createdAt: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  splitAmong: string[];
  date: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}