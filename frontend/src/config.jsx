export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Investment Management System';

export const USER_ROLES = {
    INVESTOR: 'investor',
    ADMIN: 'admin',
};

export const TRANSACTION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};
