import {Component, OnInit, ViewChild }from '@angular/core'; 
import {AngularFireDatabase, AngularFireList}from 'angularfire2/database'; 
import {Observable}from 'rxjs/Observable'; 
import {map}from 'rxjs/Operator/map'; 
import {Router}from '@angular/router'; 
import {MatTableDataSource }from '@angular/material/table'; 
import {MatSort }from '@angular/material/sort'; 
import {MatPaginator }from '@angular/material/paginator'; 
import {ToastrService }from 'ngx-toastr'; 
declare var swal:any; 
@Component( {
  selector:'app-labs', 
  templateUrl:'./labs.component.html', 
  styleUrls:['./labs.component.scss']
})
export class LabsComponent {
  displayedColumns:string[] = ['position', 'labName', 'address', 'area', 'personName', 'email', 'mnumber', 'service', 'price', 'active']; 
  dataSource; 
  @ViewChild(MatPaginator)paginator:MatPaginator; 
  @ViewChild(MatSort)sort:MatSort; 

labs; 
labsDataRef:AngularFireList < any > ; 
labObservable:Observable < any > ; 
  constructor(public af:AngularFireDatabase, public router:Router, public toastr:ToastrService) {
  	this.labsDataRef = af.list('/labs'); 
    this.generateTableData(); 
   }

   generateTableData() {
    this.labObservable = this.labsDataRef.snapshotChanges().map(changes =>  {
      return changes.map(c => ( {key:c.payload.key, ...c.payload.val()})); 
    }); 
  this.labObservable.subscribe((res) =>  {
    // this.displayedColumns.push();
    this.labs = res; 
    console.log(res)
    this.dataSource = new MatTableDataSource(this.labs); 
    this.dataSource.paginator = this.paginator; 
    this.dataSource.sort = this.sort; 
  }); 
   }

   applyFilter(event:Event) {
    const filterValue = (event.target as HTMLInputElement).value; 
    this.dataSource.filter = filterValue.trim().toLowerCase(); 

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); 
    }
  }
  
  onChange(event, key) {
    console.log(event.checked, key)
    this.labsDataRef.update(key,  {isActive:event.checked}).then((res) =>  {
      console.log(res); 
       this.toastr.success('Booking status updated!', 'Success!'); 
  }); 
  }
}