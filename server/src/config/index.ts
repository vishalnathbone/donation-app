import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'fallback_jwt_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_2026',
  dataDir: path.resolve(process.cwd(), process.env.DATA_DIR || './data'),
  backupDir: path.resolve(process.cwd(), process.env.BACKUP_DIR || './backup'),
  useSupabase: process.env.USE_SUPABASE === 'true',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_KEY || '',
  organization: {
    name: 'Shree Krishna Seva Trust',
    address: '108 Divine Complex, Temple Road, Mumbai, Maharashtra - 400001',
    mobile: '+91 98765 43210',
    email: 'info@krishnaseva.org',
    website: 'https://krishnaseva.org',
  },
};
