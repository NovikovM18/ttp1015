import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  
  rover = new FormControl('curiosity');
  camera = new FormControl('ALL');
  sol = new FormControl(995);
  earth_date = new FormControl('');
  queryingBy = new FormControl('sol');
  queryingByOptions = [
    {
      option: 'Martian sol',
      value: 'sol',
    },
    {
      option: 'Earth date',
      value: 'date',
    },
  ];
  cameras: any[] = [
    {
      option: 'All cameras',
      value: 'ALL',
    },
    {
      option: 'Front Hazard Avoidance Camera',
      value: 'FHAZ',
    },
    {
      option: 'Rear Hazard Avoidance Camera',
      value: 'RHAZ',
    },
    {
      option: 'Mast Camera',
      value: 'MAST',
    },
    {
      option: 'Chemistry and Camera Complex',
      value: 'CHEMCAM',
    },
    {
      option: 'Mars Hand Lens Imager',
      value: 'MAHLI',
    },
    {
      option: 'Mars Descent Imager',
      value: 'MARDI',
    },
    {
      option: 'Navigation Camera',
      value: 'NAVCAM',
    },
    {
      option: 'Panoramic Camera',
      value: 'PANCAM',
    },
    {
      option: 'Mini-TES',
      value: 'MINITES',
    },
  ];
  photos: any[] = [];
  rovers: string[] = [
    'curiosity',
    'opportunity',
    'spirit',
  ];
  page: number = 1;
  loading = false;
  itsAll = false;

  constructor(
    private http: HttpClient,
    public modal: MatDialog
  ) {}

  ngOnInit(): void {  
    this.getDateToday();  
    this.getPhotos(this.queryingBy.value || 'sol');
  }

  getDateToday() {
    let arrDate = new Date().toLocaleDateString().split('/');
    let dateToday = [arrDate[2], arrDate[0], arrDate[1]].join('-');
    this.earth_date.setValue(dateToday);
  }

  getPhotos(type: string) {
    this.itsAll = false;
    this.loading = true;
    let data: any = {
      page: 1,
      api_key: '6WNzRXwAJGcDkTW5TTVhnZmStIUt67zbvStbGod5',
    };
    
    if (this.camera.value !== 'ALL') {
      data.camera = this.camera.value;
    }

    if (type === 'sol') {
      data.sol = this.sol.value;
    }

    if (type === 'date') {
      data.earth_date = this.earth_date.value;
    }

    let params = new HttpParams().appendAll(data);
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.rover.value}/photos`;
    this.http.get<any>(url, {params: params})
    .subscribe((response) => {
      this.photos = response.photos;
      this.loading = false;
    }, error => {
      this.loading = false;
      alert(error.error.message);
    });
  }

  loadMore(type: string) {
    this.itsAll = false;
    this.page += 1;
    this.loading = true;
    let data: any = {
      page: this.page,
      api_key: '6WNzRXwAJGcDkTW5TTVhnZmStIUt67zbvStbGod5',
    };
    
    if (this.camera.value !== 'ALL') {
      data.camera = this.camera.value;
    }

    if (type === 'sol') {
      data.sol = this.sol.value;
    }

    if (type === 'date') {
      data.earth_date = this.earth_date.value;
    }

    let params = new HttpParams().appendAll(data);
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.rover.value}/photos`;
    this.http.get<any>(url, {params: params})
    .subscribe((response) => {
      let newArrPhotos = this.photos.concat(response.photos);
      if (this.photos.length === newArrPhotos.length) {
        this.itsAll = true;
      }
      this.photos = newArrPhotos;
      this.loading = false;
    }, error => {
      this.loading = false;
      alert(error.error.message);
    });
  }

  openModal(photo: any): void {
    this.modal.open(ModalComponent, {
      width: '90%',
      data: { photo: photo }
    });
  }
}
