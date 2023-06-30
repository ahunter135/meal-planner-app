import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { HttpEndpointResponse, HttpHandler, HttpEndpoint } from '../models/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../constants/auth';
@Injectable({
  providedIn: 'root'
})
export class RestService implements HttpHandler {

  constructor(
    private environment: EnvironmentService,
    private http: HttpClient,
    private storage: StorageService,
    private auth: AuthService
  ) { }

    get<T>(
        endpoint: string | HttpEndpoint,
        ignoreAuth?: boolean
    ): Observable<HttpEndpointResponse<T>> {
        const options: HttpEndpoint = this.getHttpEndpoint(endpoint);
        const url: string = this.getApiUrl(options);

        return this.http.get<T>(url, {
            params: options.params,
            headers: this.getHeaders(ignoreAuth, options),
            observe: 'response'
        })
        .pipe(
            map((res) => this.toHttpEndpointResponse<T>(res))
        );
    }

    post<T>(
        endpoint: string | HttpEndpoint,
        body?: any,
        ignoreAuth?: boolean
    ): Observable<HttpEndpointResponse<T>> {
        const options: HttpEndpoint = this.getHttpEndpoint(endpoint);
        const url: string = this.getApiUrl(options);

        return this.http.post<T>(url, body, {
            headers: this.getHeaders(ignoreAuth, options),
            observe: 'response',
            params: options.params
        })
        .pipe(
            map((res) => this.toHttpEndpointResponse<T>(res))
        );
    }

    put<T>(
        endpoint: string | HttpEndpoint,
        body?: any,
        ignoreAuth?: boolean
    ): Observable<HttpEndpointResponse<T>> {
        const options: HttpEndpoint = this.getHttpEndpoint(endpoint);
        const url: string = this.getApiUrl(options);

        return this.http.put<T>(url, body, {
            headers: this.getHeaders(ignoreAuth, options),
            observe: 'response',
            params: options.params
        })
        .pipe(
            map((res) => this.toHttpEndpointResponse<T>(res))
        );
    }

    delete<T>(
        endpoint: string | HttpEndpoint,
        ignoreAuth?: boolean
    ): Observable<HttpEndpointResponse<T>> {
        const options: HttpEndpoint = this.getHttpEndpoint(endpoint);
        const url: string = this.getApiUrl(options);

        return this.http.delete<T>(url, {
            headers: this.getHeaders(ignoreAuth, options),
            observe: 'response',
        })
        .pipe(
            map((res) => this.toHttpEndpointResponse<T>(res))
        );
    }

    private toHttpEndpointResponse<T>(res: HttpResponse<T>): HttpEndpointResponse<T> {
        if (!res) return undefined;

        const headers: { [name: string]: string } = {};
        for (const name of res.headers.keys()) {
            headers[name.toLocaleLowerCase()] = res.headers.get(name);
        }

        let endpointResponse: HttpEndpointResponse<T> = {
            status: res.status,
            headers,
            url: res.url
        }

        const body: T = res.body as T;
        endpointResponse.body = body;
        return endpointResponse;
    }

    private getHttpEndpoint(endpoint: string | HttpEndpoint): HttpEndpoint {
        const params = {};
        const options = typeof endpoint === 'string' ?
            ({ endpoint, params } as HttpEndpoint) :
            endpoint;
        return options;
    }

    private getHeaders(
        ignoreAuth: boolean,
        options: HttpEndpoint,
        isFileUpload: boolean = false
    ): HttpHeaders {
        let headers = this.getDefaultHeaders(ignoreAuth, isFileUpload);

        if (options.headers) {
            for (const name of Object.keys(options.headers)) {
                const value: string | string[] = options.headers[name];
                if (value) {
                    headers = headers.set(name, value);
                } else {
                    headers = headers.delete(name);
                }
            }
        }

        return headers;
    }

    private getDefaultHeaders(ignoreAuth: boolean, isFileUpload: boolean): HttpHeaders {
        let headers: { [name: string]: string } = isFileUpload ?
            {
                enctype: 'multipart/form-data',
            } :
            {
                'Content-Type': 'application/json',
            };
        if (!ignoreAuth) {
            headers = Object.assign(
                { Authorization: `Bearer ${this.auth.accessToken}` },
                headers
            );
        }
        const h = new HttpHeaders(headers);
        h.set('Cookie', `${REFRESH_TOKEN_COOKIE_NAME}=${this.auth.refreshToken}; ${ACCESS_TOKEN_COOKIE_NAME}=${this.auth.accessToken}`);
        return h;
    }

    private getApiUrl(options: HttpEndpoint): string {
        return (this.environment.server || 'default') + options.endpoint;
    }
}
