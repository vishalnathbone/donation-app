import app from './app';
import { config } from './config';
import { JsonStorageHelper } from './utils/jsonStorage';
import { seedSupabaseFromJSON } from './utils/seedSupabase';

async function startServer() {
  try {
    // Ensure 2026 and 2027 financial year data directories are initialized
    await JsonStorageHelper.ensureYearDir(2026);
    await JsonStorageHelper.ensureYearDir(2027);

    if (config.useSupabase) {
      await seedSupabaseFromJSON(2026);
    }

    app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚀 Donation Acceptance Server running on port ${config.port}`);
      console.log(`🗄️ Database storage: ${config.useSupabase ? 'Supabase PostgreSQL' : 'JSON Files'}`);
      console.log(`📂 Data directory: ${config.dataDir}`);
      console.log(`🔒 Initialized financial years: 2026, 2027`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
