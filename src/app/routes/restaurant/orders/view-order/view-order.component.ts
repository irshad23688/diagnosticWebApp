import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import {AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent{
p:any;
userDetails:any={};
address:any;
orderDetails:any={};
ordersdataRef: AngularFireObject<any>;
orderObservable:Observable<any>;
orderId:any ;
  constructor(private route: ActivatedRoute,  public router: Router, public af: AngularFireDatabase,public toastr: ToastrService) {
  	 	 	this.route.params.map(params => params['id']).subscribe((Id) => {
  	 	        if(Id != null) {
      		        this.ordersdataRef = this.af.object('/orders/' + Id);
                  this.orderId = Id;
                  this.orderObservable = this.ordersdataRef.valueChanges();
      		        this.orderObservable.subscribe((response) => {  
  		        	  this.orderDetails = response;
                  this.userDetails= response.userDetails;
                  this.address=response.shippingAddress;
                 console.log(JSON.stringify(this.address))
  		         })
              }
       });
  }

  generateInvoice(){
    this.router.navigate(['/order/invoice',this.orderId])
  }
}