#!/usr/bin/env node
'use strict';
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function main(dir, since, to) {
    dir = parseDir(dir);
    try {
        const changes = await getChanges(dir, since, to);
        console.log(changes);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

function parseDir(dir) {
    if (!dir.endsWith('.git')) dir += '/.git';
    dir = path.resolve(dir);
    if (!dir) dir = process.cwd() + '/.git';

    return dir;
}

async function getChanges(dir, since, to) {
    const opts = {replaceNewLine: true};
    if (!to) to = await execute(`git --git-dir ${dir} describe --abbrev=0 --tags`, opts);
    if (!since) since = await execute(`git --git-dir ${dir} describe --abbrev=0 $(git --git-dir ${dir} describe --abbrev=0)^`, opts);

    return await execute(`git --git-dir ${dir} log --no-merges --pretty=format:' * %s' ${since}..${to}`);
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

const argv = require('yargs').argv;
const dir = argv.dir;
const since = argv.since;
const to = argv.to;

main(dir, since, to);
