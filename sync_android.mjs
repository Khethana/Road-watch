import { execSync } from 'child_process';
console.log('Syncing Android platform...');
execSync('npx cap sync android', { stdio: 'inherit' });
console.log('Sync complete.');
