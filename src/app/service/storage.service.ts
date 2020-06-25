import { Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

const STORAGE_KEY = 'pure-awesomeness';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  array: any[] = [];
  stringArray: string;
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {}

  public Save(file: string, value): any {
    return this.storage.set(file, value);
  }
  public Load(file: string): any {
    return this.storage.get(file);
  }
  public UpdateChannlesList(newChannle: string) {
    this.stringArray = this.storage.get('ChannlesList');
    if (this.stringArray) {
      this.array = this.stringArray.split(', ');
      if (!this.array.includes(newChannle)) {
        this.array.push(newChannle);
        this.stringArray = this.array.toString();
        console.log('old', this.stringArray);
        this.storage.set('ChannlesList', this.array);
      }
    } else {
      this.array.push(newChannle);
      this.stringArray = this.array.toString();
      console.log('new', this.stringArray);
      this.storage.set('ChannlesList', this.stringArray);
    }
  }
}
