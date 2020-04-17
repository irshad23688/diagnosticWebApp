import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent implements OnInit {
  addService : FormGroup;
  categoryService:any;
  categoryData;
  categories;
  showForm=false;
  userId: any;
  constructor(private formBuilder: FormBuilder, private af: AngularFireDatabase,public authF: AngularFireAuth,
              public dialogRef: MatDialogRef<AddServicesComponent>) { }

  ngOnInit() {
    this.categoryService = this.af.list('/services');
    this.addService = this.formBuilder.group({
      serviceName: ['', Validators.required],
      // description: [''],
    });
    if (this.authF.auth.currentUser) {
      this.userId = this.authF.auth.currentUser.uid;
    }
  }
  logForm(){
    if(this.addService.invalid){
      return;
    }
    let dates= new Date();
    let serviceList={
      'createdDate': Date.now(),
      'createdId' : this.userId,
      'updatedDate': Date.now(),
      'updatedId' : this.userId,
      'isActive' :true,
      'name':this.addService.value.serviceName
    };
    console.log("ser", serviceList)

    this.categoryService.push(serviceList).then((res)=>{
      this.addService.reset();
      this.showForm=false;
    });
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
