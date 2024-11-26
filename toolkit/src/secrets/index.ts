import { createClient } from "@1password/sdk";

export class CloudSecret {
    token: string;

    constructor(token: string) {
        this.token = token
    }

    async getField(name: string, field: string): Promise<string> {
        const client = await createClient({
            auth: this.token,
            integrationName: "Update Upstream Integration",
            integrationVersion: "0.1.0",
        });

        return client.secrets.resolve(`op://cloud/${name}/${field}`);
    }

    async getCredential(name: string): Promise<string> {
        return this.getField(name, "credential")
    }
}
