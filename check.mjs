import { exec } from 'child_process';
import { writeFileSync } from 'fs';

exec('npx tsc --noEmit', (error, stdout, stderr) => {
  writeFileSync('ts_errors.txt', stdout + '\n' + stderr);
});
