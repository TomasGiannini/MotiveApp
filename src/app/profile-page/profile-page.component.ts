import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';



@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  currentlySelected = 1;

  constructor() { }

  ngOnInit(): void {
  }

  headingClicked(value: number) {

    if(value === 1) {
      //show your events
      this.currentlySelected = 1;
    }

    else if (value === 2) {
      //show upcoming events
      this.currentlySelected = 2;

    }

    else if (value === 3) {
      //show past events
      this.currentlySelected = 3;

    }

    else {
      //show your events
      this.currentlySelected = 1;

    }
  }

}
