import { Component, OnInit, OnDestroy } from '@angular/core';
import { YoutubeService } from '../service/youtube.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { LocalStorageService } from '../service/storage.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  channleId: string = '';
  videoNote: string = '';
  ChannleVideos: any[] = [];
  array: any[] = [];
  array1: any[] = [];
  array2: any[] = [];
  Channles: any[] = [];
  showlist: boolean[] = [];
  public $unsubscribe$: Subscription;
  constructor(
    public storage: LocalStorageService,
    private youTubeService: YoutubeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.$unsubscribe$.unsubscribe();
  }

  getChannelVideos(channleId: string) {
    if (this.storage.Load('ChannlesList')) {
      if (this.storage.Load('ChannlesList').includes(channleId)) {
        this.Channles = this.storage.Load('ChannlesList');
        this.array = JSON.parse(this.storage.Load(channleId));
        for (var i: number = 0; i < Math.floor(this.array.length / 2); i++) {
          this.array1.push(this.array[i]);
        }
        for (
          var i: number = Math.floor(this.array.length / 2);
          i < this.array.length;
          i++
        ) {
          this.array2.push(this.array[i]);
        }
        for (var i = 0; i < this.array.length; i++) {
          this.showlist[i] = false;
        }
      } else {
        this.ChannleVideos = [];
        this.youTubeService
          .getVideosForChanel(channleId, 15)
          .subscribe((lista) => {
            var i = 0;
            for (let element of lista['items']) {
              element = JSON.stringify(element).slice(0, -1);
              element += `,"orderId": ${i}, "note": ""}`;
              element = JSON.parse(element);
              this.ChannleVideos.push(element);
              this.showlist[i] = false;
              i++;
            }
            this.storage.Save(channleId, JSON.stringify(this.ChannleVideos));
            this.storage.UpdateChannlesList(channleId);
            this.array = JSON.parse(this.storage.Load(channleId));
            for (
              var i: number = 0;
              i < Math.floor(this.array.length / 2);
              i++
            ) {
              this.array1.push(this.array[i]);
            }
            for (
              var i: number = Math.floor(this.array.length / 2);
              i < this.array.length;
              i++
            ) {
              this.array2.push(this.array[i]);
            }
          });
      }
    } else {
      this.ChannleVideos = [];
      this.youTubeService
        .getVideosForChanel(channleId, 15)
        .subscribe((lista) => {
          var i = 0;
          for (let element of lista['items']) {
            element = JSON.stringify(element).slice(0, -1);
            element += `,"orderId": ${i}, "note": ""}`;
            element = JSON.parse(element);
            this.ChannleVideos.push(element);
            this.showlist[i] = false;
            i++;
          }
          this.storage.Save(channleId, JSON.stringify(this.ChannleVideos));
          this.storage.UpdateChannlesList(channleId);
          this.array = JSON.parse(this.storage.Load(channleId));
          for (var i: number = 0; i < Math.floor(this.array.length / 2); i++) {
            this.array1.push(this.array[i]);
          }
          for (
            var i: number = Math.floor(this.array.length / 2);
            i < this.array.length;
            i++
          ) {
            this.array2.push(this.array[i]);
          }
        });
    }
  }
  getImgUrl(url) {
    return `url(${url})`;
  }
  getVideoUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/' + url
    );
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.array, event.previousIndex, event.currentIndex);
    this.storage.Save(this.channleId, JSON.stringify(this.array));
  }
  drop1(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.array1, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        this.array2,
        this.array1,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.array = this.array1.concat(this.array2);
    this.storage.Save(this.channleId, JSON.stringify(this.array));
  }
  drop2(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.array2, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        this.array1,
        this.array2,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.array = this.array1.concat(this.array2);
    this.storage.Save(this.channleId, JSON.stringify(this.array));
  }
  onKey(event: any) {
    this.channleId = event.target.value;
  }
  search() {
    this.ChannleVideos = [];
    this.getChannelVideos(this.channleId);
  }
  onClickMe(id) {
    this.showlist[id] = true;
  }
  note(event: any) {
    this.videoNote = event.target.value;
  }
  save(id: any) {
    for (var i = 0; i < this.array.length; i++) {
      if (this.array[i].orderId === id) {
        this.array[i].note = this.videoNote;
      }
    }
    var stringArray = JSON.stringify(this.array);
    this.storage.Save(this.channleId, stringArray);
    this.array = JSON.parse(this.storage.Load(this.channleId));
    for (var i: number = 0; i < Math.floor(this.array.length / 2); i++) {
      this.array1.push(this.array[i]);
    }
    for (
      var i: number = Math.floor(this.array.length / 2);
      i < this.array.length;
      i++
    ) {
      this.array2.push(this.array[i]);
    }
    this.videoNote = '';
  }
}
