import { environment } from 'src/environments/environment';
import { Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UrlService {

  protected _baseUrl = environment.baseUrl;

  get authUrl(): string {
    return this._baseUrl + 'auth';
  }
  get emailNotInUseUrl(): string {
    return this._baseUrl + 'auth/email-is-not-in-use';
  }
  get addressInfoUrl(): string {
    return this._baseUrl + 'user/address-info';
  }
  get userUrl(): string {
    return this._baseUrl + 'user';
  }
  get chatUrl(): string {
    return this._baseUrl + 'chat';
  }
  get messageUrl(): string {
    return this.chatUrl + '/message'
  }
  get likeUrl(): string {
    return this._baseUrl + 'like';
  }
  get removeMainImageUrl(): string {
    return this._baseUrl + 'user/remove-image-url'
  }
  get notificationUrl(): string {
    return this._baseUrl + 'notification'
  }
  get imageUrl(): string {
    return this._baseUrl + 'image'
  }
}
