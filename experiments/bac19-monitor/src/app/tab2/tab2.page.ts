import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { DbService } from '../services/db.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    activity: Observable<Activity[]>;

    constructor(
        private db: DbService,
    ) {

    }

    ngOnInit(): void {
        // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        // Add 'implements OnInit' to the class.

        this.activity = this.db.getActivity();
    }

}
