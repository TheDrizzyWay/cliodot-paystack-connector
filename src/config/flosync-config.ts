import { Flosync } from 'cliodot';
import { FLOSYNC_API_KEY, FLOSYNC_API_SECRET, NODE_ENV } from './env-vars';


const paystackFlosync = new Flosync();

// Configure Cliodot SDK
paystackFlosync.configure({
  debug: NODE_ENV === 'development',
  apiKey: FLOSYNC_API_KEY,
  apiSecret: FLOSYNC_API_SECRET,
});

export default paystackFlosync;
