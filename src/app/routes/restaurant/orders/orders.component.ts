import { Component } from '@angular/core';
import { CloudinaryOptions, CloudinaryUploader } from 'ng2-cloudinary';
import { NgForm } from '@angular/forms';
import {AngularFireDatabase, AngularFireList,AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/Operator/map';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from "@angular/router";
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers:[OrdersService]
})
export class OrdersComponent {


  orders:Array<any>;
  ordersDataRef: AngularFireList<any>;
  orderObservable:Observable<any>;
  updatedOnce:boolean = false;

  userObjRef: AngularFireObject<any>;
  orderObjRef: AngularFireObject<any>;
  loyalityData: AngularFireObject<any>;
  loylityPercentage:number = 0;

  public loyalityStatus:boolean = false;
  public minLoyalityPointes:number = 0;
  
  private orderData:any = {};
  private userData:any = {};

    constructor(public af:AngularFireDatabase,
      public toastr: ToastrService,
      public router:Router,
      public ordersService:OrdersService) {
     this.ordersDataRef = af.list('/orders');
       this.orderObservable = this.ordersDataRef.snapshotChanges().map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        });
       this.orderObservable.subscribe((res)=>{       
           this.orders = res.reverse();
       });

       // loality points

       this.loyalityData = af.object('/loyalitys');
       this.loyalityData.valueChanges().subscribe((res:any) => {
         //console.log("loyalityData res "+JSON.stringify(res));
          if(res != null){ 
            this.loyalityStatus = res.enable;
            this.loylityPercentage = res.loylityPercentage;
            //console.log("minLoyalityPointes ------ "+this.loylityPercentage);
          }
        });   
    
    }

    OnChangeStatus(key,event,userId){
      //console.log("update status"+ userId);
 this.orderObjRef = this.af.object("/orders/"+key);
 this.userObjRef = this.af.object("/users/"+userId);

     if(event.target.value === 'Delivered' && this.loyalityStatus){

      let data =   this.orderObjRef.valueChanges().subscribe((res) => {
          this.orderData = res;
          //console.log("order data "+JSON.stringify(this.orderData));

          let userPoint:number;
            userPoint = Math.floor((this.orderData.grandTotal * this.loylityPercentage)/100);
            //console.log("point "+userPoint);
            data.unsubscribe();
           
           let loayltyObj:any = {
                    credit:true,
                    points: userPoint,
                    orderId: key,
                    createdAt:Date.now()  
                   }
            this.af.list('users/' + userId + '/loyaltyPoints').push(loayltyObj);
            this.af.list('/orders/' + key + '/loyaltyPoints').push(loayltyObj);
         // })
          
        //this.userInfo.loyaltyPoints.push(Math.floor(addPoint));
         //console.log("added point " + JSON.stringify(this.orderData));

         this.updateLoalityStatus(event,key);
     //        if(this.orderData.loyaltyPoints == null){
     //          let loylityPoints:any [] = [];
     //          //console.log("lo loyaltyPoints");
     //          this.orderData.loyaltyPoints = loylityPoints;
     //          //console.log("now order "+JSON.stringify(this.orderData));
     //        }
      
     //        let addPoint:number;
     //        addPoint = Math.floor((this.orderData.grandTotal * this.loylityPercentage)/100);
     //        this.orderData.loyaltyPoints.push({
     //          credit:true,
     //          points: addPoint,
     //          orderId: key,
     //          createdAt:Date.now()
            });

     //    let user =   this.userObjRef.valueChanges().subscribe((res) => {
     //      this.userData = res;
     //      //console.log("userData is before"+JSON.stringify(this.userData));
            // if(this.userData.loyaltyPoints == null){
            //   let loylityPoints:any [] = [];
            //   //console.log("lo loyaltyPoints");
            //   this.userData.loyaltyPoints = loylityPoints;
            //   //console.log("now userData "+JSON.stringify(this.userData));
            // }
            //user.unsubscribe();
            

            
         
        //});



      }// if outer closed
      
      else{
        this.updateStatus(key,event);
      }
    }

    updateLoalityStatus(event,key){
      //if(this.updatedOnce == false){
      this.orderObjRef.update({
            status:event.target.value,
            orderView:true
        }).then((res:any)=>{
           var message = { 
          app_id: "ace5d8a2-5018-4523-ab21-cff285d32524",
          contents: {"en": event.target.value},
          include_player_ids: ["31851f36-3730-4c4d-a129-fdcf380d4d86"]
        };

        this.af.list('/orders/'+key+'/statusReading').push({title:event.target.value, time:Date.now()})

         this.ordersService.sendNotification(message).subscribe(response =>{
              
        });
            this.toastr.success('Order status updated!', 'Success!');
        });
       //this.updatedOnce = true;
    // }
    }
    
    updateStatus(key,event){
      
      this.ordersDataRef.update(key,{status:event.target.value,orderView:true}).then((res)=>{
          var message = { 
          app_id: "ace5d8a2-5018-4523-ab21-cff285d32524",
          contents: {"en": event.target.value},
          include_player_ids: ["31851f36-3730-4c4d-a129-fdcf380d4d86"]
        };

        this.af.list('/orders/'+key+'/statusReading').push({title:event.target.value, time:Date.now()})

         this.ordersService.sendNotification(message).subscribe(response =>{
              
        });
            this.toastr.success('Order status updated!', 'Success!');
        });
    //}
  }


    ordersShow(key){
        this.ordersDataRef.update(key,{orderView:true}).then((res)=>{
            this.router.navigate(['/order/viewOrder', key]);
          });
    }

}