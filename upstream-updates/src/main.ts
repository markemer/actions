import * as core from "@actions/core";

import { update } from "./update";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.setSecret("op-token");

    const repo_name: string = core.getInput("repo");
    const op_token: string = core.getInput("op-token");
    const branch: string = core.getInput("branch");

    core.debug(`Updating ${repo_name}:${branch} from upstream fork`);
    await update(repo_name, { token: op_token, branch: branch });
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
