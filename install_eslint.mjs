import { execSync } from 'child_process';
console.log('Installing eslint-plugin-react-hooks...');
execSync('npm install --save-dev eslint-plugin-react-hooks', { stdio: 'inherit' });
