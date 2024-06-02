import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HackerNewsService, Story } from '../service/hacker-news.service';
import { StoriesComponent } from './stories.component';

describe('StoriesComponent', () => {
  let component: StoriesComponent;
  let fixture: ComponentFixture<StoriesComponent>;
  let hackerNewsService: jasmine.SpyObj<HackerNewsService>;

  const mockStories: Story[] = [
    { id: 1, title: 'Story 1', url: 'http://example.com/1' },
    { id: 2, title: 'Story 2', url: 'http://example.com/2' },
    { id: 3, title: 'Story 3' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HackerNewsService', ['getNewestStories']);

    await TestBed.configureTestingModule({
      declarations: [StoriesComponent],
      imports: [FormsModule],
      providers: [{ provide: HackerNewsService, useValue: spy }]
    }).compileComponents();

    hackerNewsService = TestBed.inject(HackerNewsService) as jasmine.SpyObj<HackerNewsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesComponent);
    component = fixture.componentInstance;
    hackerNewsService.getNewestStories.and.returnValue(of(mockStories));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch stories on initialization', () => {
    expect(hackerNewsService.getNewestStories).toHaveBeenCalled();
    expect(component.stories).toEqual(mockStories);
    expect(component.filteredStories).toEqual(mockStories);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error during fetching stories', () => {
    hackerNewsService.getNewestStories.and.returnValue(throwError('error'));
    component.fetchStories();
    expect(component.isLoading).toBeFalse();
  });

  it('should filter stories based on search term', () => {
    component.searchTerm = 'Story 1';
    component.search();
    expect(component.filteredStories.length).toBe(1);
    expect(component.filteredStories[0].title).toBe('Story 1');
  });

  it('should reset current page to 1 after filtering', () => {
    component.currentPage = 2;
    component.searchTerm = 'Story 1';
    component.search();
    expect(component.currentPage).toBe(1);
  });

  it('should return the correct total number of pages', () => {
    component.pageSize = 1;
    expect(component.getTotalPages()).toBe(3);
  });

  it('should paginate stories correctly', () => {
    component.pageSize = 1;
    component.currentPage = 1;
    expect(component.getPages().length).toBe(3);
  });

  it('should update current page on page change', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
  });
});
