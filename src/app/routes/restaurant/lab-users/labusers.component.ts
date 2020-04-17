import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/Operator/map';
import {Router} from '@angular/router';
// const swal = require('sweetalert');
declare var swal:any;

@Component({
  selector: 'app-labusers',
  templateUrl: './labusers.component.html',
  styleUrls: ['./labusers.component.scss']
})
export class LabUsersComponent {


labusers:Array<any>;
labs:Array<any>;
labusersDataRef:AngularFireList<any>;
labsDataRef:AngularFireList<any>;
userObservable:Observable<any>;
labObservable:Observable<any>;
  constructor(public af: AngularFireDatabase, public router: Router ) {
  	this.labusersDataRef = af.list('/users',ref=>ref.orderByChild("role").equalTo("Vendor"));
    this.userObservable = this.labusersDataRef.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  	this.userObservable.subscribe((res)=>{
      this.labusers = res;
      console.log(this.labusers);
    });
    this.labsDataRef = af.list('/labs');
    this.labObservable = this.labsDataRef.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  	this.labObservable.subscribe((res)=>{
      this.labs = res;
      console.log(this.labs);
  	});
   }

    labusersShow(key){
     this.router.navigate(['/labusers/viewUser', key]);
  }

   labusersDelete(key:any){
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
              this.labusersDataRef.update(key,{labkey:''}).then((res)=>{
                   swal('Deleted!','User Deleted Successfully!', 'success');
                 })
              } else {
                swal('Cancelled', 'Your data is safe :)', 'error');
            }
        });
  }

  labusersUpdate(key:any,labkey:any){

    swal({
            title: 'Are you sure?',
            text: 'Your will not be able to recover this data!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel!',
            closeOnConfirm: false,
            closeOnCancel: false
        }, (isConfirm) => {
            if (isConfirm) {
              
            this.labusersDataRef.update(key,{labkey:labkey}).then((res)=>{
                   swal('Updated!','User Data Updated Successfully!', 'success');
                 })
              } else {
                swal('Cancelled', 'Your data is safe :)', 'error');
            }
        });
  }

}