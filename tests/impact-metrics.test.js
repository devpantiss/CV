import test from 'node:test';
import assert from 'node:assert/strict';
import { impactMetrics } from '../src/pages/admin/impactMetrics.js';
test('impact distinguishes past events, drafts, online locations and unique participants', () => {
 const event=(date,location,published=true)=>({kind:'events',published,content:{date,location}});
 const result=impactMetrics([{kind:'partners',published:true}, {kind:'partners',published:false}, event('2026-01-01',' Hyderabad '),event('2026-11-20','hyderabad'),event('2026-12-01','Online'),event('2026-01-01','Delhi',false)], [{email:'Person@Example.com'},{email:' person@example.com '},{email:'second@example.com'}], new Date(2026,10,20));
 assert.equal(result.partners,1);assert.equal(result.conducted,1);assert.equal(result.upcoming,2);assert.equal(result.cities,1);assert.equal(result.participants,2);assert.equal(result.registrations,3);assert.equal(result.drafts,2);
});
