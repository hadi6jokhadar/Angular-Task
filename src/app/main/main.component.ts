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
  videoNote: string = '';
  ChannleVideos: any[] = [];
  array: any[] = [];
  Channles: any[] = [];
  showlist:boolean[]=[];
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
      this.Channles = this.storage.Load('ChannlesList').split(', ');
    }
    if (this.Channles.includes(channleId)) {
      this.array = JSON.parse(this.storage.Load('ChannleVideoArray'));
      console.log(this.array);      
      for(var i = 0 ;i<this.array.length;i++){
        this.showlist[i]=false;
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
            this.showlist[i]=false;
            i++;
          }
          this.storage.Save(
            'ChannleVideoArray',
            JSON.stringify(this.ChannleVideos)
          );
          this.storage.UpdateChannlesList(channleId);
          this.array = JSON.parse(this.storage.Load('ChannleVideoArray'));
          console.log('array', this.array);
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
    this.storage.Save('ChannleVideoArray', JSON.stringify(this.array));
  }
  onKey(event: any) {
    this.channleId = event.target.value;
  }
  search() {
    this.ChannleVideos = [];
    this.getChannelVideos(this.channleId);
  }
  onClickMe(id){
    this.showlist[id]=true;
    console.log(this.showlist);
    
  }
  note(event: any){
    this.videoNote = event.target.value;
  }
  save(id:any){
    for (var i = 0; i < this.array.length; i++) {
      if (this.array[i].orderId === id) {
        this.array[i].note = this.videoNote;
      }
    }
    var stringArray = JSON.stringify(this.array);
    this.storage.Save('ChannleVideoArray', stringArray);
    this.array = JSON.parse(this.storage.Load('ChannleVideoArray'));
    this.videoNote='';
    console.log(this.array);
  }
}
