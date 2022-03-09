import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormControlName, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';

  form: FormGroup;
  imagePreview: string;
  post: Post;

  private mode = 'create';
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
      // defining what elements are in the create Post form
      this.form = new FormGroup({
        title: new FormControl(null, {validators: [Validators.required]}),
        content: new FormControl(null, {validators: [Validators.required]}),
        image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
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
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
        }
        else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {
    // save the image file chosen
    const file = (event.target as HTMLInputElement).files[0];
    // storing file object
    this.form.patchValue({image: file});
    // informs angular that value changed and it should check the validity of new value
    this.form.get('image').updateValueAndValidity();

    // convert image to data URL
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if(this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

}
