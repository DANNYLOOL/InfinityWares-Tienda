import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBA';
import { GuestService } from 'src/app/services/guest.service';
import { io } from "socket.io-client";
declare var $: any;
declare var iziToast: any;
declare function stickyHeader(): any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public geo: any = {};
  public country = '';
  public currency = 'PEN';
  public token = localStorage.getItem('token');

  public categorias: Array<any> = [];
  public user: any = undefined;
  public user_lc: any = undefined;

  public carrito_arr: Array<any> = [];
  public carrito_logout: Array<any> = [];
  public url = GLOBAL.url;
  public subtotal = 0;
  public filtro_search = '';
  public socket = io(GLOBAL.socket);
  public config: any = {};

  constructor(
    private _guestService: GuestService,
    private _router: Router
  ) {
    setTimeout(() => {
      stickyHeader();
    }, 50);

    let lc_geo: any = localStorage.getItem('geo');
    this.geo = JSON.parse(lc_geo);
    this.country = this.geo.country_name;
    this.currency = this.geo.currency;

    if (this.token) {
      let obj_lc: any = localStorage.getItem('user_data');
      this.user_lc = JSON.parse(obj_lc);
      this.obtener_carrito();
    }

    if (this.user_lc == undefined) {
      let ls_cart = localStorage.getItem('cart');
      if (ls_cart != null) {
        this.carrito_logout = JSON.parse(ls_cart);
        this.calcular_carrito();
      } else {
        this.carrito_logout = [];
      }
    }
  }

  ngOnInit(): void {
    this.socket.on('new-carrito-add', (data) => {
      if (this.user_lc == undefined) {
        let ls_cart = localStorage.getItem('cart');
        if (ls_cart != null) {
          this.carrito_logout = JSON.parse(ls_cart);
          this.calcular_carrito();
        } else {
          this.carrito_logout = [];
        }
      } else {
        this.obtener_carrito();
      }
    });

    this._guestService.obtener_config_admin().subscribe(
      response => {
        this.config = response.data;
        console.log(this.config);
      }
    );

    this._guestService.get_categorias().subscribe(
      response => {
        this.categorias = response;
        console.log(response);
      }
    );
  }

  search() {
    if (this.filtro_search) {
      // Convertir el término de búsqueda a minúsculas
      const filtro = this.filtro_search.toLowerCase();

      // Verifica si el término de búsqueda coincide con una ruta específica
      if (filtro.includes('login') || filtro.includes('registro') || filtro.includes('mi cuenta') || filtro.includes('cuenta') || filtro.includes('ingresar') || filtro.includes('registrate')) {
        this._router.navigate(['/login']);
      } else if (filtro.includes('productos') || filtro.includes('inicio') || filtro.includes('home') || filtro.includes('tienda')) {
        this._router.navigate(['/']);
      } else if (filtro.includes('términos') || filtro.includes('servicio') || filtro.includes('terminos') || filtro.includes('terminos del servicio') || filtro.includes('privacidad') || filtro.includes('ayuda') || filtro.includes('informacion') || filtro.includes('información') || filtro.includes('términos del servicio')) {
        this._router.navigate(['/terminos-condiciones']);
      } else if (filtro.includes('perfil') || filtro.includes('cuenta') || filtro.includes('mi cuenta') || filtro.includes('editar')) {
        this._router.navigate(['/cuenta/perfil']);
      } else if (filtro.includes('facebook') || filtro.includes('face')) {
        window.location.href = 'https://www.facebook.com/profile.php?id=61561169150403&mibextid=ZbWKwL';
      } else if (filtro.includes('ig') || filtro.includes('instagram') || filtro.includes('insta')) {
        window.location.href = 'https://www.instagram.com/infinitywares1?igsh=MXJxMGwwYXQ4bjZmNw==';
      } else if (filtro.includes('salir') || filtro.includes('cerrar') || filtro.includes('cerrar sesion') || filtro.includes('cerrar sesión') || filtro.includes('menu') || filtro.includes('menú')) {
        this.openMenu();
      } else if (filtro.includes('carrito') || filtro.includes('cesta') || filtro.includes('cesto') || filtro.includes('carro')) {
        this.openCart();
      } else if (filtro.includes('direcciones') || filtro.includes('dirección') || filtro.includes('direccion') || filtro.includes('nueva dirección') || filtro.includes('nueva direccion') || filtro.includes('mis direcciones')) {
        this._router.navigate(['/cuenta/direcciones']);
      } else if (filtro.includes('pedidos') || filtro.includes('mis pedidos') || filtro.includes('ordenes') || filtro.includes('mis ordenes') || filtro.includes('pedido')) {
        this._router.navigate(['/cuenta/pedidos']);
      } else if (filtro.includes('reseñas') || filtro.includes('reviews') || filtro.includes('mis reseñas') || filtro.includes('review') || filtro.includes('reseña')) {
        this._router.navigate(['/cuenta/reviews']);
      } else if (filtro.includes('recuperar') || filtro.includes('recuperar contraseña') || filtro.includes('recuperar pass') || filtro.includes('recuperar password') || filtro.includes('recuperar-pass')) {
        this._router.navigate(['/login/recuperar-pass']);
      } else {
        // Si no coincide con una ruta específica, realiza la búsqueda de productos
        this._router.navigate(['/productos/'], { queryParams: { filter: filtro } });
      }
    }
  }

  openCart() {
    var clase = $('#modalCarrito').attr('class');
    console.log(clase);
    if (clase == 'ps-panel--sidebar') {
      $('#modalCarrito').addClass('active');
    } else if (clase == 'ps-panel--sidebar active') {
      $('#modalCarrito').removeClass('active');
    }
  }

  openMenu() {
    var clase = $('#modalMenu').attr('class');
    console.log(clase);
    if (clase == 'ps-panel--sidebar') {
      $('#modalMenu').addClass('active');
    } else if (clase == 'ps-panel--sidebar active') {
      $('#modalMenu').removeClass('active');
    }
  }

  calcular_carrito() {
    this.subtotal = 0;
    if (this.user_lc != undefined) {
      if (this.currency == 'PEN') {
        this.carrito_arr.forEach(element => {
          let sub_precio = parseInt(element.producto.precio) * element.cantidad;
          this.subtotal = this.subtotal + sub_precio;
        });
      } else {
        this.carrito_arr.forEach(element => {
          let sub_precio = parseInt(element.producto.precio_dolar) * element.cantidad;
          this.subtotal = this.subtotal + sub_precio;
        });
      }
    } else if (this.user_lc == undefined) {
      if (this.currency == 'PEN') {
        this.carrito_logout.forEach(element => {
          let sub_precio = parseInt(element.producto.precio) * element.cantidad;
          this.subtotal = this.subtotal + sub_precio;
        });
      } else {
        this.carrito_logout.forEach(element => {
          let sub_precio = parseInt(element.producto.precio_dolar) * element.cantidad;
          this.subtotal = this.subtotal + sub_precio;
        });
      }
    }
  }

  logout() {
    window.location.reload();
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('user_data');
    this._router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  obtener_carrito() {
    this._guestService.obtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
      response => {
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
  }

  eliminar_item_guest(item: any) {
    this.carrito_logout.splice(item._id, 1);
    localStorage.removeItem('cart');
    if (this.carrito_logout.length >= 1) {
      localStorage.setItem('cart', JSON.stringify(this.carrito_logout));
    }
    if (this.currency == 'PEN') {
      let monto = item.producto.precio * item.cantidad;
      this.subtotal = this.subtotal - monto;
    } else if (this.currency != 'PEN') {
      let monto = item.producto.precio_dolar * item.cantidad;
      this.subtotal = this.subtotal - monto;
    }
  }

  eliminar_item(id: any) {
    this._guestService.eliminar_carrito_cliente(id, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el producto correctamente.'
        });
        this.obtener_carrito();
        this.socket.emit('delete-carrito', { data: response.data });
      }
    );
  }
}
