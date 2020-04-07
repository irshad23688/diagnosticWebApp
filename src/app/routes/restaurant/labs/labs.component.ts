import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/Operator/map';
import {Router} from '@angular/router';
const swal = require('sweetalert');

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent {


labs:Array<any>;
labsDataRef:AngularFireList<any>;
labObservable:Observable<any>;
  constructor(public af: AngularFireDatabase, public router: Router ) {
  	this.labsDataRef = af.list('/labs');
    this.labObservable = this.labsDataRef.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  	this.labObservable.subscribe((res)=>{
  		this.labs = res;
  	})
   }

    labsShow(key){
     this.router.navigate(['/labs/viewlab', key]);
  }

   labsDelete(key:any){
    swal({
            title: 'Are you sure?',
            text: 'Your will not be able to recover this data!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            closeOnConfirm: false,
            closeOnCancel: false
        }, (isConfirm) => {
            if (isConfirm) {
               this.labsDataRef.remove(key).then((res)=>{
                   swal('Deleted!','lab Deleted Successfully!', 'success');
                 })
              } else {
                swal('Cancelled', 'Your data is safe :)', 'error');
            }
        });
  }

}