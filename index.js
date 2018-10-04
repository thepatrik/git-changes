const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function main() {
    try {
        const changes = getChanges();
        console.log(changes);
    } catch (err) {
        console.log(err);
    }
}

async function getChanges() {
    const opts = {replaceNewLine: true};
    const start = await execute(`git --git-dir ${__dirname}.git describe --abbrev=0 --tags`, opts);
    const next = await execute(`git --git-dir ${__dirname}.git describe --abbrev=0 $(git describe --abbrev=0)^`, opts);
    return await execute(`git --git-dir ${__dirname}.git log --no-merges --pretty=format:' * %s' ${next}..${start}`);
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

main();
