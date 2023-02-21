import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, 
  DocumentReference,QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, switchMap, Observable } from 'rxjs';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(private db: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.clipsCollection = db.collection('clips');
  }

  async createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return await this.clipsCollection.add(data);
  }

  getUserClips(): Observable<never[] | QuerySnapshot<IClip>> {
    return this.auth.user.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        );

        return query.get();
      })
    );
  }
}
