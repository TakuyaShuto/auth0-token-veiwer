import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { HttpClient } from '@angular/common/http';
import * as config from '../../auth_config.json';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /** アクセストークン. */
  token: string = null;

  /** ベースURL. */
  baseUrl: string = config.apiUri;

  /** パス. */
  path: string = '/api/';

  /** メソッド. */
  method: string = 'get';

  /** リクエストボディ. */
  requestBody: string = null;

  /** レスポンスボディ. */
  responseBody: string = null;

  response: any = null;

  error: any = null;

  constructor(
    public auth: AuthService,
    private clipboard: Clipboard,
    private httpClient: HttpClient,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit() {
    this.getToken();
  }

  loginWithRedirect() {
    this.auth.loginWithRedirect();
  }

  loginWithPopup() {
    this.auth.loginWithPopup();
  }

  logout() {
    this.auth.logout({ returnTo: this.doc.location.origin });
  }  

  getToken() {
    this.auth.getAccessTokenSilently()
      .subscribe(token => this.token = token);
  }

  copyToken() {
    this.clipboard.copy(this.token);
  }

  /**
   * リクエスト送付.
   */
  sendRequest(form: NgForm) {
    // if (form.)
    const url = `${this.baseUrl}${this.path}`;
    let res$: Observable<Object> = null;
    switch (this.method) {
      case 'get':
        res$ = this.httpClient.get(url);
        break;
      case 'delete':
        res$ = this.httpClient.delete(url);
        break;
      case 'post':
        res$ = this.httpClient.post(url, this.requestBody);
        break;
      case 'put':
        res$ = this.httpClient.post(url, this.requestBody);
        break;
    }
    res$.subscribe(res => {
      this.response = res;
      this.error = null;
    },
    err => {
      this.response = null;
      this.error = err;
    });
  }
}
