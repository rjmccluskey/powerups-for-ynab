'use strict';
const fs = require('fs');
const { exec } = require('child_process');
const packageJson = require('../../package.json');

const simplePackageJson = {
  // Use the main package json name so that the lock matches
  name: packageJson.name,
  version: '0.0.0',
  main: 'main.js',
  // Just copy all dependencies for now. Eventually this should be smarter
  // so it only uses dependencies needed for the app
  dependencies: packageJson.dependencies,
};

fs.writeFileSync(
  'dist/apps/pending-transactions/package.json',
  JSON.stringify(simplePackageJson)
);

fs.copyFileSync(
  'package-lock.json',
  'dist/apps/pending-transactions/package-lock.json'
);

const gcloudCommand = `
gcloud functions deploy pending-transactions \\
  --region=us-east1 \\
  --entry-point=main \\
  --source=dist/apps/pending-transactions/ \\
  > /dev/null
`;

console.log('Deploying pending-transactions...');
exec(gcloudCommand, (error, stdout) => {
  if (stdout) {
    console.log(stdout);
  }
  if (error) {
    throw error;
  }
  console.log('pending-transactions deployed!');
});
