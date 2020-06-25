import { Component, OnInit, OnDestroy } from '@angular/core';
import { YoutubeService } from '../service/youtube.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  channleId: String = '';
  ChannelVideos: any[];
  public $unsubscribe$: Subscription;
  constructor(
    private youTubeService: YoutubeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.$unsubscribe$.unsubscribe();
  }

  getChannelVideos(channleId: String) {
    this.ChannelVideos = [];
    this.youTubeService.getVideosForChanel(channleId, 15).subscribe((lista) => {
      for (let element of lista['items']) {
        this.ChannelVideos.push(element);
      }
      console.log(this.ChannelVideos);
    });
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
    console.log(this.ChannelVideos[0], event.previousIndex, event.currentIndex);

    moveItemInArray(
      this.ChannelVideos,
      event.previousIndex,
      event.currentIndex
    );
  }
  onKey(event: any) {
    this.channleId = event.target.value;
  }
  search() {
    this.ChannelVideos = [];
    this.getChannelVideos(this.channleId);
    console.log(this.channleId);
    this.channleId = '';
  }
}
