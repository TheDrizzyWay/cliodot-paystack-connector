import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
export const FLOSYNC_API_KEY = process.env.FLOSYNC_API_KEY;
export const FLOSYNC_API_SECRET = process.env.FLOSYNC_API_SECRET;
