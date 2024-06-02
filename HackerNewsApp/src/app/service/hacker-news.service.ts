import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap,mergeAll, toArray } from 'rxjs/operators';

export interface Story {
  id: number;
  title: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {

  private baseUrl = 'https://hacker-news.firebaseio.com/v0';

  constructor(private http: HttpClient) { }

  /***********Vimalendra* ********** 
   * Fetches the newest stories from the Hacker News API.
   * @returns An observable of an array of Story objects.
   ****END***/
  
  getNewestStories(): Observable<Story[]> {
    return this.http.get<number[]>(`${this.baseUrl}/newstories.json`).pipe(
      map(ids => ids.slice(0, 200)), //Limit to the top 200 stories
      mergeMap(ids => {
        const storyObservables = ids.map(id => this.http.get<Story>(`${this.baseUrl}/item/${id}.json`));
        return forkJoin(storyObservables); //// forkJoin to wait for all story requests to complete
      })
    );
  }
}
