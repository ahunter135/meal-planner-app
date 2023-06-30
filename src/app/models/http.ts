import { Observable } from "rxjs";
import { EnvironmentServerName } from "./environment";

export interface HttpHandler {
    get<T>(
        endpoint: string | HttpEndpoint,
    ): Observable<HttpEndpointResponse<T>>;
}

export type HttpEndpoint = {
    server?: EnvironmentServerName;
    endpoint: string;
    headers?: { [name: string]: string | string[] };
    params?: { [key: string]: string | number | boolean };
}

export type HttpEndpointResponse<T> = {
    status: number;
    headers: { [name: string]: string };
    url: string;
    body?: T;
}
