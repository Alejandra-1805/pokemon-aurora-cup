import fs from 'node:fs';
const html=fs.readFileSync('public/index.html','utf8');
const core=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const game=fs.readFileSync('public/tournament.js','utf8');
fs.writeFileSync('lib/game-source.json',JSON.stringify({core,game}));
console.log('Game replay snapshot prepared.');
