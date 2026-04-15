import { Flosync } from 'cliodot';
import dotenv from 'dotenv';

dotenv.config();

const paystackFlosync = new Flosync();

// Configure Cliodot SDK
paystackFlosync.configure({
  debug: process.env.NODE_ENV === 'development',
  apiKey: process.env.FLOSYNC_API_KEY,
  apiSecret: process.env.FLOSYNC_API_SECRET,
});

export default paystackFlosync;
