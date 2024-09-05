import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBA";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  recuperar_contraseña(email: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'recuperar_pass', { email }, { headers });
  }

  verificar_codigo(email: string, codigo: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this._http.post<any>(`${this.url}/verificar_codigo`, { email, codigo }, { headers: headers });
  }

  reenviarCodigo(email: string): Observable<any> {
    return this._http.post(this.url + 'reenviar_codigo', { email });
  }

  listar_productos_destacados_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_destacados_publico', { headers: headers });
  }

  listar_productos_nuevos_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_nuevos_publico', { headers: headers });
  }

  registro_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'registro_cliente', data, { headers: headers });
  }

  login_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_cliente', data, { headers: headers });
  }

  obtener_cliente_guest(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_cliente_guest/' + id, { headers: headers });
  }

  actualizar_perfil_cliente_guest(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_perfil_cliente_guest/' + id, data, { headers: headers });
  }

  get_categorias(): Observable<any> {
    return this._http.get('./assets/categorias.json');
  }

  listar_productos_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_publico', { headers: headers });
  }

  obtener_variedades_productos_cliente(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_variedades_productos_cliente/' + id, { headers: headers });
  }

  obtener_productos_slug_publico(slug: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_productos_slug_publico/' + slug, { headers: headers });
  }

  listar_productos_recomendados_publico(categoria: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_recomendados_publico/' + categoria, { headers: headers });
  }

  agregar_carrito_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'agregar_carrito_cliente', data, { headers: headers });
  }

  obtener_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_carrito_cliente/' + id, { headers: headers });
  }

  eliminar_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_carrito_cliente/' + id, { headers: headers });
  }

  obtener_config_admin(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_admin', { headers: headers });
  }

  verificar_token(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'verificar_token', { headers: headers });
  }

  isAuthenticate() {
    const token: any = localStorage.getItem('token');

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);

      if (!token) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

    } catch (error) {
      console.log(error);

      localStorage.clear();
      return false;
    }

    return true;
  }
}
