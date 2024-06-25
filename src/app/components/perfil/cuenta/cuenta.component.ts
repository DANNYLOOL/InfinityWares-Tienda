import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  public cliente: any = {};
  public id: any = '';
  public token: any = '';

  constructor(
    private _guestService: GuestService,
    private _router: Router
  ) {
    this.id = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');

    if (this.id) {
      this._guestService.obtener_cliente_guest(this.id, this.token).subscribe(
        response => {
          this.cliente = response.data;
        }
      );
    }
  }

  ngOnInit(): void {
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      const telefono = this.cliente.telefono;
      const password = $('#input_password').val();
      const rfc = this.cliente.dni;
      const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
      const today = new Date();
      const ageLimitDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const birthDate = new Date(this.cliente.f_nacimiento);

      if (password.length < 10 || password.length > 50) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'La contraseña debe ser de al menos 10 caracteres'
        });
      } else if (birthDate > ageLimitDate) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe tener al menos 18 años de edad.'
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
        this.cliente.password = password;
        this._guestService.actualizar_perfil_cliente_guest(this.id, this.cliente, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó su perfil correctamente.'
            });
            setTimeout(() => {
              location.reload();
            }, 900);
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
        message: 'Los datos del formulario no son válidos'
      });
    }
  }
}