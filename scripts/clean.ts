import {rmSync} from 'node:fs';

const dist = '_site';

rmSync(dist, {recursive: true, force: true});

console.log(`Cleaned ${dist} directory`);
