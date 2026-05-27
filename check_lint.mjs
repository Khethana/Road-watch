import { execSync } from 'child_process';
console.log('Running ESLint...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('Linting passed.');
} catch (e) {
  console.error('Linting failed.');
}
