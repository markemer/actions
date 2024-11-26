import { CloudSecret } from "@markemer/toolkit";
import * as core from "@actions/core";
import { Twilio } from "twilio";
import { TwilioListPicker } from "twilio/lib/rest/content/v1/content";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.setSecret("op-token");
    core.setSecret("fromPhoneNumber");
    core.setSecret("toPhoneNumber");
    core.setSecret("accountSID");
    core.setSecret("authToken");

    const op_token: string = core.getInput("op-token");
    const fromPhoneNumber: string = core.getInput("fromPhoneNumber");
    const toPhoneNumber: string = core.getInput("toPhoneNumber");
    const message: string = core.getInput("message");

    const secrets = new CloudSecret(op_token);
    const accountSID = await secrets.getField(
      "Twilio Auth Keys",
      "Account SID",
    );
    const authToken = await secrets.getField("Twilio Auth Keys", "Auth Token");

    core.debug("Authenticating with Twilio");
    const twilioClient = new Twilio(accountSID, authToken);

    core.debug("Attempting to send SMS!");
    const resultMessage = await twilioClient.messages.create({
      to: toPhoneNumber,
      from: fromPhoneNumber,
      body: message,
    });

    core.debug("SMS sent!");
  } catch (error) {
    core.setFailed("Message failed to send");
  }
}
