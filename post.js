import * as core from "@actions/core";
import * as github from "@actions/github";

try {
    const check_run_id = core.getState('check_run_id');
    const token = core.getInput("token") || process.env.GITHUB_TOKEN;

    const octokit = github.getOctokit(token);

    await octokit.rest.checks.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        check_run_id: check_run_id,
        status: 'completed',
        conclusion: github.context.conclusion === 'success' ? 'success' : 'failure',
        output: {
            title: 'completed...',
            summary: `It is ${github.context.conclusion}\n\n## Context\n\`\`\`json\n${JSON.stringify(core, null, 2)}\n\`\`\``,
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
