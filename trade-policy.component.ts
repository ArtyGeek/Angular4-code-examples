import { Component, OnInit } from '@angular/core';
import { PopupService } from './../../../shared-components/popup/popup.service';
import { TradePolicyValidator } from './trade-policy.validator';
import { InstantTranslationService } from './../../../../localization/instant-translation.service';
import { TradePolicyModel } from './../../../../models/user-profile/trade-policy/trade-policy.model';
import { TradePolicyMapper } from './trade-policy.mapper';
import { TradePolicyOperationsService } from './trade-policy-operations.service';
import { TradePolicyHttpService } from './trade-policy-http.service';

@Component({
    moduleId: module.id,
    templateUrl: 'trade-policy.component.html',
    styleUrls: ['trade-policy.component.css'],
    providers: [TradePolicyOperationsService, TradePolicyHttpService]
})

export class TradePolicyComponent implements OnInit {
    tradePolicy: TradePolicyModel;
    mapper: TradePolicyMapper;
    validator: TradePolicyValidator;

    constructor(private _operationsService: TradePolicyOperationsService,
            private _httpService: TradePolicyHttpService,
            private _translation: InstantTranslationService,
            private _popup: PopupService) {

        this.tradePolicy = new TradePolicyModel();
        this.mapper = new TradePolicyMapper(this.tradePolicy);
        this.validator = new TradePolicyValidator(this.tradePolicy);
    }

    ngOnInit() {
        this._httpService.getPolicyDatas()
            .subscribe(data => this.mapper.mapFromResponse(data));
    }

    addRange(min: number, max: number) {
        this._operationsService.pushRange(this.tradePolicy.ranges, min, max);
    }

    editRange(index) {
        this._operationsService.editRange(this.tradePolicy.ranges, index);
    }

    removeRange(index) {
        const settings = {
            type: 'confirm',
            title: 'Delete',
            message: 'Are you sure?'
        };

        this._popup.open(settings)
            .on('confirm', () => {
                this._operationsService.removeRange(this.tradePolicy.ranges, index);
            });
    }

    addPayType(prepayementPercent: number, payAfterDays: number) {
        this._operationsService.pushPayType(this.tradePolicy.payTypes, prepayementPercent, payAfterDays);
    }

    removePayType(index) {
        const settings = {
            type: 'confirm',
            title: 'Delete',
            message: 'Are you sure?'
        };

        this._popup.open(settings)
            .on('confirm', () => {
                this._operationsService.removePayType(this.tradePolicy.payTypes, index);
            });
    }

    checkPrepay(payType) {
        this._operationsService.checkPrepay(payType);
    }

    save() {
        this._operationsService.removeDublicatesFromPayTypes(this.tradePolicy.payTypes);
        if (!this.validator.isPayTypesValid) {
            return;
        }

        this._httpService.putPolicyDatas(this.mapper.APIModel)
            .subscribe(data => {
                this._popup.open({
                    type: 'success',
                    message: 'Saved'
                });
                this.mapper.mapFromResponse(data);
            });
    }
}
