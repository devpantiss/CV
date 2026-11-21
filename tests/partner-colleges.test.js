import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContent } from '../src/features/content/validation.js';
import { validateUpload } from '../supabase/functions/_shared/file-policy.js';
import { partnerDefaults } from '../src/features/partners/defaults.js';
test('partner colleges require a name and HTTPS website links',()=>{assert.throws(()=>validateContent('partners',{name:''}),/required/);for(const website of ['javascript:alert(1)','http://example.com','//example.com'])assert.throws(()=>validateContent('partners',{name:'College',website}),/HTTPS/);assert.doesNotThrow(()=>validateContent('partners',{name:'College',website:'https://example.com'}));});
test('partner uploads allow bounded raster logos and reject executable/vector files',()=>{assert.equal(validateUpload({name:'logo.png',type:'image/png',size:1000},'partners').mediaType,'image');for(const file of [{name:'logo.svg',type:'image/svg+xml',size:50},{name:'logo.png',type:'image/png',size:5242881}])assert.throws(()=>validateUpload(file,'partners'));});
test('existing homepage partners retain their names and original logo positions',()=>{assert.equal(partnerDefaults.length,55);assert.equal(new Set(partnerDefaults.map(row=>row.name)).size,55);for(const row of partnerDefaults){assert.match(row.image,/^\/affiliates\//);assert.match(row.logoPosition,/^[\d.]+% [\d.]+%$/);}});
