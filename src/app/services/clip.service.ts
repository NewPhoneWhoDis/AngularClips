import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, 
  DocumentReference,QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { of, switchMap, map } from 'rxjs';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = db.collection('clips');
  }

  async createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return await this.clipsCollection.add(data);
  }

  
  getUserClips(): any {
    return this.auth.user.pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        );

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    //!Selects document by ID
    return this.clipsCollection.doc(id).update({ title: title });
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clip-${clip.fileName}`);

    await clipRef.delete();

    await this.clipsCollection.doc(clip.docID).delete();
  }
}
