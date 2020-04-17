import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-locations',
  templateUrl: './add-locations.component.html',
  styleUrls: ['./add-locations.component.css']
})
export class AddLocationsComponent implements OnInit {
  addLocations : FormGroup;
  categoryLocations:any;
  categoryData;
  categories;
  showForm=false;
  userId: any;
  constructor(private formBuilder: FormBuilder, private af: AngularFireDatabase,public authF: AngularFireAuth,
              public dialogRef: MatDialogRef<AddLocationsComponent>) { }

  ngOnInit() {
    this.categoryLocations = this.af.list('/locations');
    this.addLocations = this.formBuilder.group({
      location: ['', Validators.required],
      // description: [''],
    });
    if (this.authF.auth.currentUser) {
      this.userId = this.authF.auth.currentUser.uid;
    }
  }
  logForm(){
    if(this.addLocations.invalid){
      return;
    }
    let dates= new Date();
    let serviceList={
      'createdDate': Date.now(),
      'createdId' : this.userId,
      'updatedDate': Date.now(),
      'updatedId' : this.userId,
      'isActive' :true,
      'name':this.addLocations.value.location
    };
    console.log("ser", serviceList)

    this.categoryLocations.push(serviceList).then((res)=>{
      this.addLocations.reset();
      this.showForm=false;
    });
  }
  onNoClick(){
    this.dialogRef.close();
  }
}

