import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/model/product.service';
import { IProduct } from 'src/app/shared/model/product';

const HTTP_URL_PATTERN: string =
  '^((http[s]?):\\/)\\/?([^:\\/\\s]+)((\\/\\w+)*)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$';
const TEXT_PATTERN: string = 
'^[a-zA-Z ]*$';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  
  public productForm: FormGroup;
  
  constructor(fb: FormBuilder, public productService: ProductService) {
    this.productForm = fb.group({
      id: [null],
      productName: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(80)]],
      productCode: [''],
      releaseDate: [new Date()],
      description: [''],
      price: [0, Validators.min(0)],
      starRating: [0, [Validators.min(0), Validators.max(5)]],
      imageUrl: ['', Validators.pattern(HTTP_URL_PATTERN)]
 })    

   }

  ngOnInit(): void {
  }

  public onSubmit() {
    console.log('Form submitted');
    if (this.productForm.valid) {
      let data:IProduct = this.productForm.value;
      this.productService.save(data).subscribe(
        product => console.log(`My product was saved ${product.id}`)
      )
    }
  }


}
