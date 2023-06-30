export type Environment = {
    production: boolean;

    servers: { [name in EnvironmentServerName]: string };
    appSettings: EnvironmentAppSettings;
}

export type EnvironmentServerName = 'local' | 'default';
export type EnvironmentAppSettings = {};
