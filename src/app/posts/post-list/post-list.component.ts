import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component1.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  private postsSub: Subscription;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    //this.postsService.getPosts(this.postsPerPage,this.currentPage);
    //this.userId = this.authService.getUserId();



    // 使用mock
    /*this.posts = ['4ttt-1646255362488.jpg',
      '123-1646763514921.jpg', '123-1646765434138.jpg',
      '123-1646765763244.png', '123-1646766155169.jpg', 'tomas22-1646172529005.jpg',
      '345-1646765470942.jpg', 'ffff-1646762233912.jpg', 'rrr-1646760741962.jpg',
      'vfvdv-1646170173122.jpg', 'ttt-1646675511647.jpg', 'vvvvvvvvv-1646855681860.jpg'
    .map((tt, i) => {
      return {
        id: 'id_' + i,
        title: 'images_' + i,
        content: 'images_images images_images_images_images images_images images images_images images_',
        imagePath: '/assets/images/' + tt,
        creator: '' + i,
      }
    })
    this.totalPosts = this.posts.length;
    this.calcGroup(this.posts);
    */

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    // subscribes to update listener
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.calcGroup(postData.posts);
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    // check authentication status of the user
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();

      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  /* 计算瀑布流图片分组 */
  // average colomn width 400px
  postGroup: { height: number, list: Post[] }[] = [
    { height: 0, list: [] },
    { height: 0, list: [] },
    { height: 0, list: [] },
  ];

  calcGroup(postList: Post[]) {
    postList.forEach(tt => {
      let img = new Image();
      img.onload = () => {
        let h = 400 / img.width * img.height;// get the calculated height
        h += tt.title.length * 25;// add weight to title
        h += tt.content.length * 20;// add weight to content
        let minHItem = this.postGroup[0];
        this.postGroup.forEach(p => {
          if (p.height < minHItem.height) minHItem = p;
        });
        minHItem.height += h;
        minHItem.list.push(tt);
        // console.log(img.width, img.height, h)
      }
      img.src = tt.imagePath;
    });
  }

}
