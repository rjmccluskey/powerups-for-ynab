'use strict';
const fs = require('fs');
const { exec } = require('child_process');
const packageJson = require('../../package.json');

const simplePackageJson = {
  name: 'track-by-balance',
  version: '0.0.0',
  main: 'main.js',
  // Just copy all dependencies for now. Eventually this should be smarter
  // so it only uses dependencies needed for the app
  dependencies: packageJson.dependencies,
};

fs.writeFileSync(
  'dist/apps/track-by-balance/package.json',
  JSON.stringify(simplePackageJson)
);

const gcloudCommand = `
gcloud functions deploy track-by-balance \\
  --region=us-east1 \\
  --entry-point=main \\
  --source=dist/apps/track-by-balance/ \\
  > /dev/null
`;

console.log('Deploying track-by-balance...');
exec(gcloudCommand, (error, stdout) => {
  if (stdout) {
    console.log(stdout);
  }
  if (error) {
    throw error;
  }
  console.log('track-by-balance deployed!');
});
