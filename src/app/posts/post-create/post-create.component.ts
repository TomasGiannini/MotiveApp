import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';

  form: FormGroup;
  post: Post;

  private mode = 'create';
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
      this.form = new FormGroup({
        'title': new FormControl(null, {validators: [Validators.required]}),
        'content': new FormControl(null, {validators: [Validators.required]})
      });

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        // check if there is a postId in URL, indicating if in 'Create' or 'Edit' mode
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.postsService.getPost(this.postId).subscribe(postData => {
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content
            };
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content
            });
          });
        }
        else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onSavePost() {
    if(this.form.invalid) {
      return;
    }

    if (this.mode == 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    }
    else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content)
    }

    this.form.reset();
  }

}
