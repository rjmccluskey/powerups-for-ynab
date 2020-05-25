import { main } from './app';

if (process.env.NODE_ENV === 'development') {
  main();
}

export { main };
