import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, Images, SearchGifsResponse, The480_WStill } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private url: string = 'https://api.giphy.com/v1/gifs'
  private apiKey: string = 'e3Qk1JQs2tLqpcyrJS2DIISeHf28aGlY'
  private _historial: string[] = []
  private _gifs: string[] = []

  get historial(): string[] {

    return [...this._historial]
  }

  get gifs(): string[] {

    return [...this._gifs]
  }

  constructor(
    private http: HttpClient
  ) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []
    this._gifs = JSON.parse(localStorage.getItem('gifs')!) || []
  }

  buscarGifs(query: string) {
    if (!this._historial.includes(query)) {
      this._historial.unshift(query)
      this._historial = this._historial.splice(0, 10)
      localStorage.setItem('historial', JSON.stringify(this.historial))
    }
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', '10')
    // const url = `${this.url}/search?api_key=${this.apiKey}&q=${query}&limit=10`
    const url = `${this.url}/search`
    console.log({ url })
    this.http.get<SearchGifsResponse>(url, { params })
      .subscribe((res) => {
        const { data } = res
        console.log({ data })
        // this._gifs = data.map((item: any) => item.url)
        this._gifs = data
          .map((item: Gif) => item.images)
          .map((item: Images) => item.downsized_large)
          .map((item: The480_WStill) => item.url);

        localStorage.setItem('gifs', JSON.stringify(this.gifs))
        console.log({ gifs: this.gifs })
      })
    console.log(this.historial)
  }
}
