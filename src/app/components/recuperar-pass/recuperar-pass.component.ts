import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuestService } from 'src/app/services/guest.service';
import { Router } from '@angular/router';
declare var iziToast: any;

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.component.html',
  styleUrls: ['./recuperar-pass.component.css']
})
export class RecuperarPassComponent implements OnInit {

  public emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _guestService: GuestService,
    private _router: Router,
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  recuperarPass() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this._guestService.recuperar_contraseña(email).subscribe(
        response => {
          if (response.success) {
            iziToast.show({
              title: 'ÉXITO',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Contraseña temporal enviada correctamente.'
            });
            this._router.navigate(['/login']);
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
        },
        error => {
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error al enviar el correo de recuperación. Por favor, inténtelo de nuevo.'
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
        message: 'Por favor, ingrese un correo válido.'
      });
    }
  }
}