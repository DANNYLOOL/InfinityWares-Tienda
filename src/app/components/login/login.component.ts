import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token = localStorage.getItem('token');
  public registroForm: FormGroup;
  public op = 1;
  public carrito_logout: Array<any> = [];

  siteKey: string = '6Lc96_wpAAAAABM9IZVEgJMMxBhYa4nnImjikmF4';

  constructor(
    private fb: FormBuilder,
    private _guestService: GuestService,
    private _router: Router,
  ) {
    this.registroForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      f_nacimiento: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.token) {
      this._router.navigate(['/']);
    }
    localStorage.removeItem('cart');
    localStorage.removeItem('_id');
    localStorage.removeItem('user_data');
  }

  changeOp(op: any) {
    this.op = op;
  }

  func_login(loginForm: any) {
    if (loginForm.valid) {
      this.login(this.user.email, this.user.password);
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
    }
  }

  login(email: any, password: any) {
    let data: any = {
      email: email,
      password: password
    }

    let ls_cart = localStorage.getItem('cart');
    if (ls_cart != null) {
      this.carrito_logout = JSON.parse(ls_cart);
    } else {
      this.carrito_logout = [];
    }

    data.carrito = this.carrito_logout;

    this._guestService.login_cliente(data).subscribe(
      response => {
        if (response.data == undefined) {
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: response.message
          });
        } else {
          iziToast.show({
            title: 'ÉXITO',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Credenciales correctas.'
          });
          this.usuario = response.data;
          localStorage.removeItem('cart');
          localStorage.setItem('_id', response.data._id);
          localStorage.setItem('user_data', JSON.stringify(response.data));
          //localStorage.setItem('token', response.token);
          this._router.navigate(['/login/token']);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  registro() {
    if (this.registroForm.valid) {
      const telefono = this.registroForm.value.telefono;
      const email = this.registroForm.value.email;
      const password = this.registroForm.value.password;
      const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
      const emailValidationRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      const today = new Date();
      const ageLimitDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

      const birthDate = new Date(this.registroForm.value.f_nacimiento);

      if (birthDate > ageLimitDate) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe tener al menos 18 años de edad.'
        });
      } else if (password.length < 10 || password.length > 50) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'La contraseña debe ser de al menos 10 caracteres'
        });
      } else if (!passwordValidationRegex.test(password)) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'
        });
      } else if (!emailValidationRegex.test(email)) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El formato del correo electrónico no es válido'
        });
      } else if (!/^\d{10}$/.test(telefono)) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El número de teléfono debe tener 10 dígitos.'
        });
      } else {
        console.log(this.registroForm.value);

        this._guestService.registro_cliente(this.registroForm.value).subscribe(
          response => {
            console.log(response);

            if (response.data != undefined) {
              iziToast.show({
                title: 'ÉXITO',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se registró correctamente.'
              });
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: response.message
              });
            }
          }
        );
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario están incompletos'
      });
    }
  }
}
