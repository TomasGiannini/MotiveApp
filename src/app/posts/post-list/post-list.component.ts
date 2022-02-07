import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) { }

  ngOnInit() {

    this.postsService.getPosts();

    // subscribes to update listener
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
      this.postsSub.unsubscribe();
  }

  /*
  posts = [
    { title: 'First Post', content: 'Content of post' },
    { title: 'Second Post', content: 'Content of post' },
    { title: 'Third Post', content: 'Content of post' }
  ]
  */


}
