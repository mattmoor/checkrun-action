import * as core from "@actions/core";
import * as github from "@actions/github";

try {
    const sha = core.getInput("sha");
    const name = core.getInput("name");

    const { data: check_run } = await github.rest.checks.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        name: name,
        head_sha: sha,
        status: 'in_progress',
        output: {
            title: 'started...',
            summary: 'Hey, look it works...',
        }
    });

    core.saveState('check_run_id', check_run.id);
} catch (error) {
    core.setFailed(error.message);
}