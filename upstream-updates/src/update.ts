import { CloudSecret } from '@markemer/toolkit';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { RequestError } from '@octokit/request-error';
import { existsSync, readFileSync } from 'fs';

export interface UpdateOptions {
  token: string;
  branch: string;
}

export interface RepoList {
  repos: string[];
}

export async function updateRepos(
  fileName: string,
  options: UpdateOptions,
): Promise<void> {
  if (existsSync(fileName)) {
    const fileData = readFileSync(fileName, { encoding: 'utf8' });
    const configFile: RepoList = JSON.parse(fileData);
    for (const repo of configFile.repos) {
      update(repo, options);
    }
  } else {
    core.setFailed(`Could not find ${fileName}`);
  }
}

export async function update(
  repo: string,
  options: UpdateOptions,
): Promise<void> {
  core.debug(`Updating ${repo}:${options.branch} from upstream fork`);

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
