import { Injectable } from '@angular/core';
import {
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
} from '../constants/auth';
import {
    BehaviorSubject,
    from,
    Observable,
    of,
    throwError

} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';
import { Tokens } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    jwtHelper: JwtHelperService = new JwtHelperService();
    
    private authenticationStateSubject: BehaviorSubject<AuthenticationState> = 
        new BehaviorSubject<AuthenticationState>(AuthenticationState.Unknown);

    private accessTokenSubject: BehaviorSubject<string> =
        new BehaviorSubject<string>('');
    private refreshTokenSubject: BehaviorSubject<string> =
        new BehaviorSubject<string>('');
    constructor(
        private storage: StorageService
    ) { }

    // Subscribe to this for auth state changes
    get authenticationState$(): Observable<AuthenticationState> {
        return this.authenticationStateSubject.asObservable();
    }

    get isAuthenticated(): boolean {
        return this.authenticationStateSubject.value === AuthenticationState.Authenticated;
    }

    get accessToken$(): Observable<string> {
        return this.accessTokenSubject.asObservable();
    }

    get refreshToken$(): Observable<string> {
        return this.refreshTokenSubject.asObservable();
    }

    get refreshToken(): string {
        return this.refreshTokenSubject.value;
    }

    get accessToken(): string {
        return this.accessTokenSubject.value;
    }

    // Updates the authentication state and the access token
    async updateAccessToken(accessToken: string | undefined): Promise<void> {
        let newState: AuthenticationState = AuthenticationState.Unknown;
        let promise: Promise<any>;

        if (accessToken) {
            newState = AuthenticationState.Authenticated;
            this.accessTokenSubject.next(accessToken);
            promise = this.storage.set(ACCESS_TOKEN_COOKIE_NAME, accessToken);
        } else {
            newState = AuthenticationState.Unauthenticated;
            this.accessTokenSubject.next('');
            promise = this.storage.remove(ACCESS_TOKEN_COOKIE_NAME);
        }

        return promise
            .then(() => {
                if (this.authenticationStateSubject.value !== newState) {
                    this.authenticationStateSubject.next(newState);
                }
            });
    }

    async updateRefreshToken(refreshToken: string | undefined): Promise<void> {
        if (refreshToken) {
            this.refreshTokenSubject.next(refreshToken);
            return this.storage.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
        } else {
            this.refreshTokenSubject.next('');
            return this.storage.remove(REFRESH_TOKEN_COOKIE_NAME);
        }
    }

    // Store the tokens in storage
    async storeTokens(tokens: Tokens): Promise<void> {
        return this.updateAccessToken(tokens.accessToken).then(() => {
            return this.updateRefreshToken(tokens.refreshToken);
        });
    }

    // Get email from JWT token
    decodeToken(token: string): string {
        const { email } = this.jwtHelper.decodeToken(token);
        return email;
    }

    // Logs user out and deletes their tokens
    deauthenticate(): void {
       this.updateAccessToken(undefined);
       this.storage.remove(REFRESH_TOKEN_COOKIE_NAME);
    }
}

export enum AuthenticationState {
    Unknown,
    Verifying,
    Authenticated,
    Unauthenticated
}
