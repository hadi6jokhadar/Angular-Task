import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

const STORAGE_KEY = 'pure-awesomeness';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {}

  public Save(): any {}
  public Load(): any {}
}
