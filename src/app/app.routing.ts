import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";
import { CuentaComponent } from "./components/perfil/cuenta/cuenta.component";
import { DireccionesComponent } from "./components/perfil/direcciones/direcciones.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { ShowProductoComponent } from "./components/productos/show-producto/show-producto.component";
import { CarritoComponent } from "./components/carrito/carrito.component";
import { PedidosComponent } from "./components/perfil/pedidos/pedidos.component";
import { ReviewsComponent } from "./components/perfil/reviews/reviews.component";
import { TerminosCondicionesComponent } from "./components/static/terminos-condiciones/terminos-condiciones.component";
import { NotfoundComponent } from "./components/notfound/notfound.component";
import { AuthGuard } from "../app/guards/auth.guard";
import { TokenComponent } from './components/token/token.component';
import { RecuperarPassComponent } from './components/recuperar-pass/recuperar-pass.component';

const appRoute : Routes = [
    {path: '', component: IndexProductoComponent},
    {path: 'login', component: LoginComponent},

    {path: 'cuenta/perfil', component: CuentaComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/direcciones', component: DireccionesComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/pedidos', component: PedidosComponent, canActivate:[AuthGuard]},
    {path: 'cuenta/reviews', component: ReviewsComponent, canActivate:[AuthGuard]},

    {path: 'carrito', component: CarritoComponent},

    {path: 'productos', component: IndexProductoComponent},
    {path: 'productos/categoria/:categoria', component: IndexProductoComponent},
    {path: 'productos/:slug', component: ShowProductoComponent},

    {path: 'terminos-condiciones', component: TerminosCondicionesComponent},
    {path: 'login/token', component: TokenComponent },
    {path: 'login/recuperar-pass', component: RecuperarPassComponent },
    {path: '**', component: NotfoundComponent}
]

export const appRoutingPorviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute, { onSameUrlNavigation: 'reload' });