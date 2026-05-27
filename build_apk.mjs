import { spawn } from 'child_process';
import path from 'path';

console.log('Building Android Debug APK... This may take 10-20 minutes on the first run.');

const gradle = spawn('cmd.exe', ['/c', 'gradlew.bat', 'assembleDebug'], {
  cwd: path.join(process.cwd(), 'android'),
  stdio: 'inherit'
});

gradle.on('close', (code) => {
  console.log(`Gradle process exited with code ${code}`);
});
