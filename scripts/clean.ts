import {rmSync} from 'node:fs';

rmSync('_site', {recursive: true, force: true});

console.log('Cleaned _site directory');
