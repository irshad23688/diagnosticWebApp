import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/Operator/map';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
declare var swal : any;
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

roleKey;
userId;
bookings;
bookingsDataRef:AngularFireList<any>;
usersDataRef:AngularFireList<any>;
bookingObservable:Observable<any>;
  constructor(public af: AngularFireDatabase, public router: Router , public toastr: ToastrService,
    private afd: AngularFireAuth) {
  	this.bookingsDataRef = af.list('/bookings');
    // this.bookingObservable = this.bookingsDataRef.snapshotChanges().map(changes => {
    //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    //   });
  	// this.bookingObservable.subscribe((res)=>{
  	// 	// this.bookings = res;
  	// })
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
  OnChangePaymentStatus(key,event){ 
    this.bookingsDataRef.update(key,{pStatus:event.target.value}).then((res)=>{
      this.toastr.success('Payment status updated!', 'Success!');
  });
  }

  ngOnInit(){
    this.bookings=[];
    let responseDetails=[];
    if (this.afd.auth.currentUser) {
      this.userId = this.afd.auth.currentUser.uid;
      this.af.object('/users/' + this.userId).valueChanges().subscribe((res: any) => {
        console.log(res);
        this.roleKey=res.role;
        if(res.role==='Admin'){
          this.af.list('/bookings',ref=>ref.orderByChild("createdDate")).snapshotChanges().subscribe(res=>{
            console.log('if',res);
            responseDetails=res;
            this.bookings=[]
            responseDetails.forEach(item => {
              let temp = item.payload.val();
              // this.discountedPrice= temp.value;
              temp["$key"] = item.payload.key;
              this.bookings.push(temp);
              console.log('temp', this.bookings)

              // console.log("orders-" + JSON.stringify(this.couponDetails));
            });
          });
        } else{
          
          this.af.list('/bookings',ref=>ref.orderByChild("labKey").equalTo(res.labKey)).snapshotChanges().subscribe(res=>{
            console.log('else',res);
            responseDetails=res;
            this.bookings=[];
            responseDetails.forEach(item => {
              let temp = item.payload.val();
              // this.discountedPrice= temp.value;
              temp["$key"] = item.payload.key;
              this.bookings.push(temp);
              console.log('temp', this.bookings);

              // console.log("orders-" + JSON.stringify(this.couponDetails));
            });
          });
        }
      });
    }
  }

}