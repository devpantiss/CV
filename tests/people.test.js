import test from 'node:test';
import assert from 'node:assert/strict';
import { isExpert, profileCategory } from '../src/features/content/people.js';
import { teamDefaults } from '../src/features/content/defaults.js';
import { validateContent } from '../src/features/content/validation.js';
test('existing profiles split into one team member and four experts without overlap', () => {
  assert.deepEqual(teamDefaults.filter(member => !isExpert(member)).map(member => member.name), ['Divya Rupainwar']);
  assert.equal(teamDefaults.filter(isExpert).length, 4);
});
test('explicit category overrides legacy identity and job title; new staff stay in Team', () => {
  assert.equal(profileCategory({name:'Sonali Mulay',role:'Education expert',profileType:'team'}),'team');
  assert.equal(profileCategory({name:'New profile',role:'Founder',profileType:'expert'}),'expert');
  assert.equal(profileCategory({name:'New colleague',role:'Admissions coordinator'}),'team');
});
test('invalid profile categories are rejected before saving', () => {
  assert.throws(()=>validateContent('team',{name:'Test',role:'Advisor',profileType:'both'}),/profile category/);
  assert.doesNotThrow(()=>validateContent('team',{name:'Test',role:'Advisor',profileType:'expert'}));
});
