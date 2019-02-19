import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Activity } from '../models/activity';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class DbService {

    activityCollection: AngularFirestoreCollection<Activity>;
    activityDocument: AngularFirestoreDocument<Activity>;

    constructor(
        public afs: AngularFirestore,

    ) {

        this.activityCollection = this.afs.collection('Activity');

    }


    getSnapshot() {
        return this.activityCollection.snapshotChanges()
            .pipe(
                map(actions => {
                    return actions
                        .map(a => {
                            return { id: a.payload.doc.id, ...a.payload.doc.data() };
                        });
                })
            );
    }


    getActivity() {

        return this.afs.collection<Activity>(this.activityCollection.ref, qry => {
            return qry.orderBy('timestamp', 'desc')
                .limit(10);
        }).valueChanges();
    }

    getActivityDetail(id) {
        return this.afs.doc<Activity>('Activity/' + id);
    }

}
