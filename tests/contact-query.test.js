import test from 'node:test';
import assert from 'node:assert/strict';
import { contactDetails } from '../src/features/contact/validation.js';
const valid={name:' Visitor ',email:'VISITOR@EXAMPLE.TEST ',phone:'',topic:'Other',message:'First line\nSecond line',consent:true};
test('contact queries normalize details, allow an optional phone and preserve message line breaks',()=>{const result=contactDetails({...valid,admin:true});assert.equal(result.name,'Visitor');assert.equal(result.email,'visitor@example.test');assert.equal(result.message,valid.message);assert.equal(result.admin,undefined);});
test('contact queries reject missing consent, invalid fields, unknown topics and oversized messages',()=>{for(const change of [{consent:false},{consent:'true'},{email:'bad'},{phone:'abcdefg'},{name:''},{topic:'Injected topic'},{message:'x'.repeat(3001)},{name:'a\nb'}])assert.throws(()=>contactDetails({...valid,...change}));});
