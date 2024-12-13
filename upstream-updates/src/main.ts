import * as core from '@actions/core';
import { update, updateRepos } from './update';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.setSecret('op-token');

    const repo_name: string = core.getInput('repo');
    const file_name: string = core.getInput('repo-file');
    const op_token: string = core.getInput('op-token');
    const branch: string = core.getInput('branch');

    if(repo_name != "") {
      await update(repo_name, { token: op_token, branch: branch });
    } else if (file_name != "") {
      await updateRepos(file_name, { token: op_token, branch: branch });
    } else {
      core.setFailed("Either repo or repo-file is required");
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
