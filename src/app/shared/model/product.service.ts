import { Injectable } from '@angular/core';
import { IProduct, Product } from './product'
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, tap } from 'rxjs/operators'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsFromAPI: IProduct[] = [
    {
        "id": 1,
        "productName": "Leaf Rake",
        "productCode": "GDN-0011",
        "releaseDate": "March 19, 2016",
        "description": "Leaf rake with 48-inch wooden handle.",
        "price": 19.95,
        "starRating": 3.2,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
    },
    {
        "id": 2,
        "productName": "Garden Cart",
        "productCode": "GDN-0023",
        "releaseDate": "March 18, 2016",
        "description": "15 gallon capacity rolling garden cart",
        "price": 32.99,
        "starRating": 4.2,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/58471/garden_cart.png"
    },
    {
        "id": 5,
        "productName": "Hammer",
        "productCode": "TBX-0048",
        "releaseDate": "May 21, 2016",
        "description": "Curved claw steel hammer",
        "price": 8.9,
        "starRating": 4.8,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/73/rejon_Hammer.png"
    },
    {
        "id": 8,
        "productName": "Saw",
        "productCode": "TBX-0022",
        "releaseDate": "May 15, 2016",
        "description": "15-inch steel blade hand saw",
        "price": 11.55,
        "starRating": 3.7,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/27070/egore911_saw.png"
    },
    {
        "id": 10,
        "productName": "Video Game Controller",
        "productCode": "GMG-0042",
        "releaseDate": "October 15, 2015",
        "description": "Standard two-button video game controller",
        "price": 35.95,
        "starRating": 4.6,
        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/120337/xbox-controller_01.png"
    }
  ]

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  private _products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private products$: Observable<Product[]> = this._products.asObservable();

  constructor(public http: HttpClient) {
    this.fetch()
  }

  public fetch() {
    // Create an observable from the get method of HttpClient service
    // which will return a IProduct[] object
    // which is transformed to Product[] array
    this.http.get<IProduct[]>('http://localhost:3000/products').pipe(
      // combining standard js map with observable map
      map(ps => ps.map(p => new Product(p))),
      // tap does not change the returned object
      tap(ps2 => console.log(`Products number: ${ps2.length}`)
      )
    ).subscribe(
      // mapped observable returns Product[] array
      // _products is a BehaviorSubject 
      // next takes the Product[] array as new/initial input for the BS
      prods => this._products.next(prods)
    )
  }

  public getProducts$(): Observable<Product[]> {
    // products$ is an observable which takes the output of _products as its source
    return this.products$
  }

  public getProductById$(id: number): Observable<Product> {
    return this.products$.pipe(
      // as with getProducts$ except here we want to filter the array based on the ID
      map(products => products.find(product => product.id === id))
    )
  }

  public save(product: IProduct): Observable<IProduct> {
    if (product.id === null) { // We have to create the product (POST)
      return this.http.post<IProduct>('http://localhost:3000/products', product, this.httpOptions).pipe(
        tap(product => console.log(`New product: ${product.id}`)),
        tap(() => this.fetch())
      )
    } else { // We have to update a product (PUT)
      return this.http.put<IProduct>(`http://localhost:3000/products/${product.id}`, product, this.httpOptions).pipe(
        tap(product => console.log(`Edit product: ${product.id}`)),
        tap(() => this.fetch())
      )
    }
  }

}
