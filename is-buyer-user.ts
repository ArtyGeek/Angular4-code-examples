import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanLoad, Route
} from '@angular/router';

import { UserModel } from './../models/user.model';
import { CoreGlobals } from './../modules/core-globals';

@Injectable()
export class IsBuyer implements CanActivate {
    private _user: UserModel;

    constructor(private router: Router, private _coreGlobals: CoreGlobals) {
        this._coreGlobals.userData.subscribe(user => this._user = user);
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return this.isBuyer();
    }

    private isBuyer(): boolean {
        if (this._user.role === 'Buyer') {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}