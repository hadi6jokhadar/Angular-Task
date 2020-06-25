import { Component, OnInit, OnDestroy } from '@angular/core';
import { YoutubeService } from '../service/youtube.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LocalStorageService } from '../service/storage.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  channleId: string = '';
  ChannleVideos: any[] = [];
  array: any[] = [];
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
    this.ChannleVideos = [];
    this.youTubeService.getVideosForChanel(channleId, 15).subscribe((lista) => {
      var i = 0;
      for (let element of lista['items']) {
        element = JSON.stringify(element).slice(0, -1);
        element += `,"orderId": ${i}, "note": ""}`;
        element = JSON.parse(element);
        this.ChannleVideos.push(element);
        i++;
      }
      var stringArray = JSON.stringify(this.ChannleVideos);
      this.storage.Save('ChannleVideoArray', stringArray);
      this.storage.UpdateChannlesList(channleId);
    });
    this.array = JSON.parse(this.storage.Load('ChannleVideoArray'));
    console.log(this.array);
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
    for (var i = 0; i < this.array.length; i++) {
      if (this.array[i].Id === event.previousIndex) {
        this.array[i].orderId = event.currentIndex;
      }
    }
    var stringArray = JSON.stringify(this.array);
    this.storage.Save('ChannleVideoArray', stringArray);
    this.array = JSON.parse(this.storage.Load('ChannleVideoArray'));
    moveItemInArray(this.array, event.previousIndex, event.currentIndex);
  }
  onKey(event: any) {
    this.channleId = event.target.value;
  }
  search() {
    this.ChannleVideos = [];
    this.getChannelVideos(this.channleId);
  }
}
