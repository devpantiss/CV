import test from 'node:test';
import assert from 'node:assert/strict';
import { functionErrorMessage } from '../src/lib/functionError.js';
test('function errors preserve server recovery messages',async()=>{assert.equal(await functionErrorMessage({context:Response.json({error:'Reconnect Google Drive.'})},'Retry'),'Reconnect Google Drive.');});
test('network and non-JSON errors show a safe retry message',async()=>{for(const error of [null,{}, {context:new Error('network')},{context:{json:'not a function'}},{context:new Response('Bad gateway')},{context:Response.json({error:{internal:'details'}})}])assert.equal(await functionErrorMessage(error,'Please retry.'),'Please retry.');});
