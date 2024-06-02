import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService, Story } from './hacker-news.service';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });
    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch newest stories', () => {
    const dummyStories: Story[] = [
      { id: 1, title: 'Story 1', url: 'http://example.com/1' },
      { id: 2, title: 'Story 2', url: 'http://example.com/2' }
    ];

    service.getNewestStories().subscribe(stories => {
      expect(stories.length).toBe(2);
      expect(stories).toEqual(dummyStories);
    });

    const req = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/newstories.json');
    expect(req.request.method).toBe('GET');
    req.flush([1, 2]);

    const req1 = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/item/1.json');
    expect(req1.request.method).toBe('GET');
    req1.flush(dummyStories[0]);

    const req2 = httpMock.expectOne('https://hacker-news.firebaseio.com/v0/item/2.json');
    expect(req2.request.method).toBe('GET');
    req2.flush(dummyStories[1]);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
