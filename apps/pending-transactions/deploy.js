'use strict';
const fs = require('fs');
const { exec } = require("child_process");
const packageJson = require('../../package.json');

const simplePackageJson = {
  name: 'pending-transactions',
  version: '0.0.0',
  // Just copy all dependencies for now. Eventually this should be smarter
  // so it only uses dependencies needed for the app
  dependencies: packageJson.dependencies
};

fs.writeFileSync(
  'dist/apps/pending-transactions/package.json',
  JSON.stringify(simplePackageJson)
);

const gcloudCommand = `
gcloud functions deploy pending-transactions \\
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
