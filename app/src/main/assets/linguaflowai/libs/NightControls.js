import { getTimes } from './SunCalc.js';

export function isNightTime(lat, lon) {
  const times = getTimes(new Date(), lat, lon);
  const now = new Date();
  return now < times.sunrise || now > times.sunset;
}