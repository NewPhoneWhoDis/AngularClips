import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, 
  DocumentReference,QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { of, switchMap, map, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router'
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {
  public clipsCollection: AngularFirestoreCollection<IClip>
  pageClips: IClip[] = [];
  pendingRequests: boolean = false;

  constructor(private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips');
  }
  
  async createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return await this.clipsCollection.add(data);
  }
  
  
  getUserClips(sort$: BehaviorSubject<string>): any {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values;
        
        if (!user) {
          return of([]);
        }
        
        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
          ).orderBy(
            'timestamp',
            sort === '1' ? 'desc' : 'asc'
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
          const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`);
          
          await clipRef.delete();
          await screenshotRef.delete();
          
          await this.clipsCollection.doc(clip.docID).delete();
        }
        
        async getClips() {
          if (this.pendingRequests) return;
          
          this.pendingRequests = true;
          let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);
          
          const { length } = this.pageClips;
          
          if(length) {
            let lastDocumentId = this.pageClips[length - 1].docID;
            let lastDocument = await this.clipsCollection.doc(lastDocumentId).get().toPromise();
            
            query = query.startAfter(lastDocument);
          }
          
          let snapshot = await query.get();
          
          snapshot.forEach(doc => {
            this.pageClips.push({
              docID: doc.id,
              ...doc.data()
            })
          })
          
          this.pendingRequests = false;
        }

        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
          return this.clipsCollection.doc(route.params.id).get()
          .pipe(
            map(snapshot => {
              const data = snapshot.data;

              if(!data) {
                this.router.navigate(['/']);
                return null;
              }

              return data;
            })
          );
        }
      }
      