import { CloudSecret } from '@markemer/toolkit';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { RequestError } from '@octokit/request-error';

export interface UpdateOptions {
  token: string;
  branch: string;
}

export async function update(
  repo: string,
  options: UpdateOptions,
): Promise<void> {
  const secrets = new CloudSecret(options.token);

  const token = await secrets.getCredential('macports_update_token');

  const username = github.context.repo.owner;

  const octokit = github.getOctokit(token);

  try {
    const updated_repo = await octokit.rest.repos.mergeUpstream({
      owner: username,
      repo: repo,
      branch: options.branch,
    });

    const message = updated_repo.data.message;

    if (typeof message == 'string') {
      core.info(message);
    } else {
      core.warning('No message from merge');
    }
  } catch (error) {
    if (error instanceof RequestError) {
      switch (error.status) {
        case 409:
          core.setFailed('Merge Conflict with Upstream');
          break;
        default:
          core.setFailed(error.message);
          break;
      }
    } else {
      if (error instanceof Error) core.setFailed(error.message);
    }
  }
}
