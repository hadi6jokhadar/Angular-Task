import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  apiKey: string = 'AIzaSyAevtQ1ZKbtNy6j8pFDjyWvAYRAbdL2wwg';

  constructor(public http: HttpClient) {}

  getVideosForChanel(channel, maxResults): Observable<Object> {
    let url =
      'https://www.googleapis.com/youtube/v3/search?key=' +
      this.apiKey +
      '&channelId=' +
      channel +
      '&order=date&part=snippet &type=video,id&maxResults=' +
      maxResults;
    return this.http.get(url).pipe(
      map((res) => {
        return res;
      })
    );
  }
  SearchForChanel(query, maxResults): Observable<Object> {
    let url =
      'https://www.googleapis.com/youtube/v3/search?key=' +
      this.apiKey +
      '&channelType=any&order=relevance&type=channel&q=' +
      query +
      '&part=snippet&type=channel,id&maxResults=' +
      maxResults;
    return this.http.get(url).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
