import { createClient } from "@1password/sdk";

export async function getCredential(token: string, name: string): Promise<string> {
    const client = await createClient({
        auth: token,
        integrationName: "Update Upstream Integration",
        integrationVersion: "0.1.0",
      });

      const credential = client.secrets.resolve(`op://cloud/${name}/credential`);

      return credential
}
