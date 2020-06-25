import { Component, OnInit, OnDestroy } from '@angular/core';
import { YoutubeService } from '../service/youtube.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit, OnDestroy {
  videos: any[];
  channels: any[];
  ChannelVideos: any[];
  public $unsubscribe$: Subscription;
  constructor(
    private youTubeService: YoutubeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getChannelVideos();
  }
  ngOnDestroy(): void {
    this.$unsubscribe$.unsubscribe();
  }

  getChannelVideos() {
    this.ChannelVideos = [];
    this.youTubeService
      .getVideosForChanel('UC3cEGKhg3OERn-ihVsJcb7A', 15)
      .subscribe((lista) => {
        for (let element of lista['items']) {
          this.ChannelVideos.push(element);
        }
        console.log(this.ChannelVideos);
      });
  }
  searchChannel() {
    this.channels = [];
    this.$unsubscribe$ = this.youTubeService
      .SearchForChanel('Angular', 15)
      .subscribe((lista) => {
        for (let element of lista['items']) {
          this.channels.push(element);
        }
        console.log(this.channels);
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
}
