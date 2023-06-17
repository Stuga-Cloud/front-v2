export class ContainerApplicationSecret {
    name: string;
    value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

export type ContainerApplicationSecrets = ContainerApplicationSecret[];
