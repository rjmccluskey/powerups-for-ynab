import { DateTime } from 'luxon';

export function now(): DateTime {
  return DateTime.local().setZone('America/Los_Angeles');
}
