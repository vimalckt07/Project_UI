import { Component, OnInit } from '@angular/core';
import { HackerNewsService, Story } from '../service/hacker-news.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

  stories: Story[] = [];
  filteredStories: Story[] = [];
  pageSize = 20;
  currentPage = 1;
  searchTerm: string = '';
  isLoading: boolean = false; // Loading state

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit(): void {
    
    this.fetchStories();
  }

  
  /*******************
   * Fetches the newest stories and sets the loading state.
   ****************/
  fetchStories(): void {
    this.isLoading = true; // Start loading
    this.hackerNewsService.getNewestStories().subscribe(stories => {
      this.stories = stories;
      this.filteredStories = stories;
      this.isLoading = false; // Stop loading
    }, error => {
      console.error('Error fetching stories:', error);
      this.isLoading = false; // Stop loading on error
    });
  }
 
  /********************
   * Filters stories based on the search term.
   * Resets the current page to 1 after filtering.
   ******************/
  search(): void {
    debugger;
    if (this.searchTerm.trim() === '') {
      this.filteredStories = this.stories;
    } else {
      this.filteredStories = this.stories.filter(story =>
        story && story.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1; // Reset to the first page after search
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
  getPages(): number[] {
    const totalStories = this.filteredStories.length;
    return Array(Math.ceil(totalStories / this.pageSize)).fill(0).map((x, i) => i + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredStories.length / this.pageSize);
  }
}
