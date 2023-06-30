import { Injectable } from '@angular/core';
import { 
    Environment,
    EnvironmentServerName,
    EnvironmentAppSettings
} from '../models/environment';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
    private _environment: Environment = environment;

    public get production(): boolean {
        return this._environment.production;
    }
    public get allServers(): { [name in EnvironmentServerName]: string } {
        return this._environment.servers;
    }
    public get server(): string {
        if (this.production) {
            return this.allServers.default;
        }
        return this.allServers.local;
    }
    public get appSettings(): EnvironmentAppSettings {
        return this._environment.appSettings;
    }

    constructor() { }
}
