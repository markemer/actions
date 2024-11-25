import * as core from "@actions/core";
import * as twillio from "twilio";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
    try {
        const op_token: string = core.getInput("op-token");
        const fromPhoneNumber: string = core.getInput('fromPhoneNumber')
        const toPhoneNumber: string = core.getInput('toPhoneNumber')
        const message: string = core.getInput('message')



    } catch (error) {

    }
}
