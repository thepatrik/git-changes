'use strict';
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const argv = require('yargs').argv;

async function main(dir, since, to, silent) {
    dir = parseDir(dir);
    try {
        const changes = await getChanges(dir, since, to);
        if (!silent) console.log(changes);
        return changes;
    } catch (err) {
        if (!silent) console.log(err);
        process.exit(1);
    }
}

function parseDir(dir) {
    if (!dir) dir = process.cwd();
    if (!dir.endsWith('.git')) dir += '/.git';
    dir = path.resolve(dir);

    return dir;
}

async function getChanges(dir, since, to) {
    const opts = {replaceNewLine: true};
    if (!to) to = await execute(`git --git-dir ${dir} describe --abbrev=0 --tags`, opts);
    if (!since) {
        try {
            since = await execute(`git --git-dir ${dir} describe --abbrev=0 $(git --git-dir ${dir} describe --abbrev=0)^`, opts);
        } catch (err) {}
    }

    return await execute(`git --git-dir ${dir} log --no-merges --pretty=format:' * %s' ` + (since ? `${since}..${to}`: `${to}`));
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

module.exports = opts => {
    if (!opts) opts = {};
    const dir = opts.dir ? opts.dir : argv.dir;
    const since = opts.since ? opts.since : argv.since;
    const to = opts.to ? opts.to : argv.to;

    return main(dir, since, to, opts.silent);
};
