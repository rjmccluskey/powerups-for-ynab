import { config } from 'dotenv';
import { main } from './main';

// This test requires environment variables to be set in a .env file
config();

/**
 * Unskip this to test and debug locally. This test should never run in CI.
 */
it.skip('works', async () => {
  await main();
});
