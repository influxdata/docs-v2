import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import noComments from '../eslint/no-comments.js';

RuleTester.describe = describe;
RuleTester.it = it;

const jsTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
const tsTester = new RuleTester({
  languageOptions: { parser: tseslint.parser, sourceType: 'module' },
});
const removeComment = [{ messageId: 'removeComment' }];

jsTester.run('no-comments', noComments, {
  valid: [
    '#!/usr/bin/env node\nrun();',
    '/* eslint-disable no-console */\nconsole.log(1);',
    'run(); // eslint-disable-line no-console',
    '/* global Alpine */\nAlpine.start();',
    '// prettier-ignore\nconst grid = [1,0,\n  0,1];',
    '/* c8 ignore next */\nrun();',
    '/* istanbul ignore next */\nrun();',
    'const lazy = import(/* webpackChunkName: "lazy" */ "./lazy.js");',
    'const value = /* @__PURE__ */ create();',
    '/*!\n * Copyright 2024 InfluxData\n */\nrun();',
    '// SPDX-License-Identifier: MIT\nrun();',
    '/** Formats a date. */\nexport function format() {}',
    '/** Formats a date. */\nexport default function format() {}',
    '/** The sample day. */\nexport const sampleDay = 1;',
    '/** Formats a date. */\nfunction format() {}\nexport { format };',
    '// WHY: Safari 16 drops the event without a passive listener.\nrun();',
    '/* WHY: The vendor widget renders in a closed shadow root. */\nrun();',
  ],
  invalid: [
    { code: '// Formats a date.\nfunction format() {}', errors: removeComment },
    { code: 'run(); // trailing note', errors: removeComment },
    { code: '/* block note */\nrun();', errors: removeComment },
    {
      code: '/** Formats a date. */\nfunction format() {}',
      errors: removeComment,
    },
    {
      code: '/** Not exported. */\nconst day = 1;\nconst other = 2;\nexport { other };',
      errors: removeComment,
    },
    {
      code: 'run();\n/*!\n * Copyright 2024 InfluxData\n */',
      errors: removeComment,
    },
    {
      code: '// why: lowercase tag is not the marker\nrun();',
      errors: removeComment,
    },
    { code: '// TODO: rename this\nrun();', errors: removeComment },
    {
      code: '// First note.\n// Second note.\nrun();',
      errors: [...removeComment, ...removeComment],
    },
  ],
});

tsTester.run('no-comments with TypeScript', noComments, {
  valid: [
    '/// <reference types="cypress" />\ncy.visit("/");',
    '// @ts-expect-error The vendor types omit this field.\nwidget.secret = 1;',
    '/** A sample date. */\nexport interface SampleDate { day: number }',
    '/** A day count. */\nexport type Days = number;',
  ],
  invalid: [
    {
      code: '// Sample date shape.\ninterface SampleDate { day: number }',
      errors: removeComment,
    },
    { code: 'const days: number = 1; // count of days', errors: removeComment },
  ],
});
