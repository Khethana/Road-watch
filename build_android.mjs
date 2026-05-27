import { execSync } from 'child_process';

console.log('Building web app...');
execSync('npx vite build', { stdio: 'inherit' });

console.log('Syncing Android platform...');
try {
    execSync('npx cap sync android', { stdio: 'inherit' });
} catch (error) {
    console.log('Android platform not found, adding it...');
    execSync('npx cap add android', { stdio: 'inherit' });
}

console.log('Done.');
