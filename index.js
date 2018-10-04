#!/usr/bin/env node
'use strict';
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function main(dir) {
    try {
        const changes = await getChanges(dir);
        console.log(changes);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

async function getChanges(dir) {
    const opts = {replaceNewLine: true};
    const start = await execute(`git --git-dir ${dir} describe --abbrev=0 --tags`, opts);
    const next = await execute(`git --git-dir ${dir} describe --abbrev=0 $(git --git-dir ${dir} describe --abbrev=0)^`, opts);
    return await execute(`git --git-dir ${dir} log --no-merges --pretty=format:' * %s' ${next}..${start}`);
}

async function execute(cmd, opts) {
    const { stdout, stderr } = await exec(cmd);
    if (stderr) {
        throw new Error('Could not find next tag');
    }
    if (opts && opts.replaceNewLine) {
        return stdout.replace('\n', '');
    }
    return stdout;
}

const argv = require('yargs').argv
let dir = argv.dir;
if (dir) {
    if (!dir.endsWith('.git')) dir += '/.git'
    dir = path.resolve(dir);
} else {
    dir = process.cwd() + '/.git'
}

console.log(dir);

main(dir);
