import test from 'node:test';
import assert from 'node:assert/strict';
import { catalystEvents, calendarDay } from '../src/features/events/catalystCalendar.js';
test('official calendar preserves all 13 dates, cities and venues in order',()=>{assert.equal(catalystEvents.length,13);assert.equal(new Set(catalystEvents.map(event=>event.id)).size,13);assert.equal(catalystEvents[0].date,'2026-12-02');assert.equal(catalystEvents.at(-1).city,'Ahmedabad');assert.equal(catalystEvents.at(-1).date,'2027-02-12');assert.deepEqual(catalystEvents.map(event=>event.date),catalystEvents.map(event=>event.date).sort());for(const event of catalystEvents){assert.ok(event.venue);assert.equal(event.time,'Time to be announced');}});
test('weekday labels are computed from the date rather than the poster typo',()=>{assert.equal(calendarDay('2027-01-22'),'Friday');assert.equal(calendarDay('2026-12-02'),'Wednesday');});
