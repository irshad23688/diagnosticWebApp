import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FirebaseApp } from 'angularfire2';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, mergeMap, first } from 'rxjs/operators';
@Component({
  selector: 'app-daily-reports',
  templateUrl: './daily-reports.component.html',
  styleUrls: ['./daily-reports.component.css']
})
export class DailyReportsComponent implements OnInit {
  displayedColumns:string[] = ['position', 'labName', 'address', 'area', 'personName', 'email', 'mnumber', 'service', 'price', 'active']; 
  dataSource;
  product;
  @ViewChild(MatPaginator)paginator:MatPaginator; 
  @ViewChild(MatSort)sort:MatSort; 
  test;
  labsDataRef:AngularFireList<any>;
  labObservable;
  ;
  constructor( private af: AngularFireDatabase,private afs: AngularFirestore) { 
   
    // rootDbRef.on('value', snapshot => console.log(snapshot.val()));
  }

  ngOnInit() {
    this.getProductDetail();
    // const firestorePlacesCollection = this.afs.collection('/bookings');

    //READ
  //  const  places$ = firestorePlacesCollection.snapshotChanges().pipe(
  //     map(actions => {
  //       console.log(actions)
  //       // return actions.map(p => {
  //       //   const place = p.payload.doc;
  //       //   const id = place.id;
  //       //   return { id, ...place.data() } ;
  //       // });
  //     })
  //   );

    
  }

  getProductDetail() {
    this.labsDataRef = this.af.list('/bookings');
    this.labObservable = this.labsDataRef.snapshotChanges().map(changes => {
      console.log(changes)
        return changes.map( async c => 
          ({ key: c.payload.key,
          // product: await this.getLabData(c.payload.val().labKey),
          ...c.payload.val() }))
      });
      console.log("labObs=>", this.labObservable)
    this.labObservable.subscribe((res)=>{
      // this.labs = res;
      console.log("Subscription",res);
    });
    
    }
    getLabData(key){
      console.log(key)
      var self =this;
     return new Promise((resolve,reject)=>{
      self.af.list(`labs/${key}`).valueChanges().map(changes => {
        console.log('changes', changes)
          return changes.map(c=>{
            console.log('c=', c)
            resolve(c);

          })
      });
        // console.log(changes)
     });
    
  }

  getData(){
    
      const product$ =  this.afs.collection('/bookings').doc('2MV0G5xMw0Z2ghHDtxpP')
        .snapshotChanges()
        .pipe(
          map(snap => {
            console.log(snap)
            return {id:snap.payload.id, ...snap.payload.data()}
          })
          , mergeMap( product=> { 
                  return this.afs.doc('/labs/'+ product.id).valueChanges()
                      .pipe(
                          map(user => {
                              return {...user, ...product}  
                              })
                           )      
                       })
          )
        
      product$.subscribe(product => {
        this.product = product
        console.log(product);
      })
    }
    
  
 
  
  // getTotalQuestions(idForm:string): Observable<string> {
  //   let totalQuestions:number;
  //   var subject = new Subject<string>();
  //   this.getFirebaseData(idForm+"/Metadatos")
  //   .subscribe(items => {
  //       items.map(item => {
    
  //         totalQuestions=item.Total;
  //         console.log(totalQuestions);
  //         subject.next(totalQuestions);
  //       });
  //     }
  //   );
  //     return subject.asObservable();
  //   }
  
}