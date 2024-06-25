import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
declare var iziToast: any;

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  public tokenForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _guestService: GuestService,
    private _router: Router,
  ) {
    this.tokenForm = this.fb.group({
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  verificarCodigo() {
    if (this.tokenForm.valid) {
      const codigo = this.tokenForm.value.codigo;
      const userData = localStorage.getItem('user_data');

      if (userData) {
        const user = JSON.parse(userData);
        const email = user.email;

        this._guestService.verificar_codigo(email, codigo).subscribe(
          response => {
            if (response.claveRespuesta === 1) {
              iziToast.show({
                title: 'ÉXITO',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Código verificado correctamente.'
              });
              localStorage.setItem('token', response.token);
              this._router.navigate(['/']);
            } else {
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: 'Código incorrecto. Por favor, inténtelo de nuevo.'
              });
            }
          },
          error => {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'Código incorrecto. Por favor, inténtelo de nuevo.'
            });
          }
        );
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'No se pudo obtener el email del usuario. Por favor, intente nuevamente.'
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Por favor, ingrese el código de verificación.'
      });
    }
  }

  reenviarCodigo() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      const email = user.email;

      this._guestService.reenviarCodigo(email).subscribe(
        response => {
          iziToast.show({
            title: 'ÉXITO',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Código reenviado correctamente.'
          });
        },
        error => {
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Hubo un problema al reenviar el código. Por favor, inténtelo de nuevo.'
          });
        }
      );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No se pudo obtener el email del usuario. Por favor, intente nuevamente.'
      });
    }
  }
}
