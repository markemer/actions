import { CloudSecret } from '@markemer/toolkit';
import * as core from '@actions/core';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.setSecret('op-token');

    const op_token: string = core.getInput('op-token');
    const secrets = new CloudSecret(op_token);

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
