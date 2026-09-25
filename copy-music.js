const fs = require('fs');
const source = 'C:/Users/User/OneDrive/Dokumen/New folder/a-thousand-years.mp3';
const target = 'C:/Users/User/OneDrive/Dokumen/New folder/a-thousand-years-final.mp3';

if (!fs.existsSync(source)) {
  console.error('Source file not found:', source);
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log('Copied song to:', target);
console.log('Size:', fs.statSync(target).size);
