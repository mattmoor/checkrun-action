import * as core from "@actions/core";
import * as github from "@actions/github";

try {
    const check_run_id = core.getState('check_run_id');
    const token = core.getInput("token") || process.env.GITHUB_TOKEN;
    const status = core.getInput("status");

    const octokit = github.getOctokit(token);

    await octokit.rest.checks.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        check_run_id: check_run_id,
        status: 'completed',
        conclusion: 'success',
        output: {
            title: 'completed...',
            summary: `Job completed with status: ${status}`,
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
