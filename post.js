import * as core from "@actions/core";
import * as github from "@actions/github";

try {
    const check_run_id = core.getState('check_run_id');
    const token = core.getInput("token") || process.env.GITHUB_TOKEN;

    const octokit = github.getOctokit(token);

    // Get the current job from the workflow run to determine its status
    const { data: { jobs } } = await octokit.rest.actions.listJobsForWorkflowRun({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        run_id: github.context.runId,
    });

    // Find the current job - it should still be "in_progress" when post runs
    const currentJob = jobs.find(job =>
        job.status === 'in_progress' || job.status === 'completed'
    ) || jobs[0];

    // Map job conclusion to check run conclusion
    // If job is still in_progress, we assume success unless steps failed
    let conclusion = 'success';
    if (currentJob.conclusion) {
        conclusion = currentJob.conclusion;
    } else if (currentJob.steps) {
        // Check if any steps failed
        const failedStep = currentJob.steps.find(step => step.conclusion === 'failure');
        if (failedStep) {
            conclusion = 'failure';
        }
    }

    await octokit.rest.checks.update({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        check_run_id: check_run_id,
        status: 'completed',
        conclusion: conclusion,
        output: {
            title: 'completed...',
            summary: `Job completed with status: ${conclusion}`,
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
