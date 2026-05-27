import { execSync } from 'child_process';
console.log('Installing eslint-plugin-react-refresh...');
execSync('npm install --save-dev eslint-plugin-react-refresh --legacy-peer-deps', { stdio: 'inherit' });
