import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/lib/shared.ts',import.meta.url),'utf8').replace("import React from 'react';",'const React={useMemo(){},useState(){},useEffect(){}};').replace("import { DATA } from './data';",'const DATA={contact:{enquiry:{href:"mailto:info@nexaragroups.com"}}};');
const {buildBriefText,buildBriefMailto,getBriefSections}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const form={section:'academy',city:'Visakhapatnam',timeline:'1-3 months',audience:'Students & freshers',context:'',successMetric:'Portfolio proof',name:'Learner',email:'learner@example.com'};
test('initial server and browser brief text is deterministic without a render-time date',()=>{assert.ok(!buildBriefText(getBriefSections(),form).includes('Generated on:'));assert.ok(buildBriefText(getBriefSections(),form,'2026-10-08').includes('Generated on: 2026-10-08'));});
test('internship enquiry preserves the selected Academy lane and encodes the email body',()=>{const text=buildBriefText(getBriefSections(),form);const href=buildBriefMailto(getBriefSections(),form,text);assert.ok(href.startsWith('mailto:info@nexaragroups.com?'));const params=new URLSearchParams(href.split('?')[1]);assert.ok(params.get('subject').includes('Academy (Talent)'));assert.equal(params.get('body'),text);});
