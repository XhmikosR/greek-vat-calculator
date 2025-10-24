#!/usr/bin/env node

/*!
 * Script to run vnu-jar if Java is available.
 * Copyright 2017-2024 The Bootstrap Authors
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

import {execFile, spawn} from 'node:child_process';
import {globSync} from 'node:fs';
import process from 'node:process';
import vnu from 'vnu-jar';

execFile('java', ['-version'], (error, _stdout, stderr) => {
  if (error) {
    console.error('Skipping vnu-jar test; Java is probably missing.');
    console.error(error);
    return;
  }

  console.log('Running vnu-jar validation...');

  const is32bitJava = !stderr.includes('64-Bit');

  // vnu-jar accepts multiple ignores joined with a `|`.
  // Also note that the ignores are string regular expressions.
  const ignores = [
    'The “inputmode” attribute is not supported in all browsers.*'
  ].join('|');

  // Get all HTML files except those starting with 'google'
  const htmlFiles = globSync('_site/**/*.html')
    .filter((file: string) => !file.includes('google'))
    .join(' ');

  if (!htmlFiles) {
    console.log('No HTML files to validate.');
    return;
  }

  const args = [
    '-jar',
    `"${vnu}"`,
    '--asciiquotes',
    '--skip-non-html',
    '--Werror',
    `--filterpattern "${ignores}"`,
    htmlFiles
  ];

  // For the 32-bit Java we need to pass `-Xss512k`
  if (is32bitJava) {
    args.splice(0, 0, '-Xss512k');
  }

  console.log(`command used: java ${args.join(' ')}`);

  return spawn('java', args, {
    shell: true,
    stdio: 'inherit'
  })
    .on('exit', process.exit);
});
