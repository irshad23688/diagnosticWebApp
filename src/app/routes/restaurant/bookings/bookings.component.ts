import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/Operator/map';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
const swal = require('sweetalert');

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent {


bookings:Array<any>;
bookingsDataRef:AngularFireList<any>;
bookingObservable:Observable<any>;
  constructor(public af: AngularFireDatabase, public router: Router , public toastr: ToastrService) {
  	this.bookingsDataRef = af.list('/bookings');
    this.bookingObservable = this.bookingsDataRef.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  	this.bookingObservable.subscribe((res)=>{
  		this.bookings = res;
  	})
   }

    bookingsShow(key){
     this.router.navigate(['/bookings/viewbooking', key]);
  }

   bookingsDelete(key:any){
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
               this.bookingsDataRef.remove(key).then((res)=>{
                   swal('Deleted!','booking Deleted Successfully!', 'success');
                 })
              } else {
                swal('Cancelled', 'Your data is safe :)', 'error');
            }
        });
  }

  OnChangeStatus(key,event){ 
    
    this.bookingsDataRef.update(key,{status:event.target.value}).then((res)=>{
        this.toastr.success('Booking status updated!', 'Success!');
        
    });
  }
  OnChangePaymentStatus(key,event,userId){ 
    this.bookingsDataRef.update(key,{pStatus:event.target.value}).then((res)=>{
      this.toastr.success('Payment status updated!', 'Success!');
  });
  }


}