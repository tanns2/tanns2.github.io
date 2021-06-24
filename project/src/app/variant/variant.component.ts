import { Component, Input, OnChanges } from "@angular/core";
import {
  AppComponent,
  BusinessModelConfig,
  Meta,
  Recommendation,
} from "../app.component";

@Component({
  selector: "mvp-variant",
  templateUrl: "./variant.component.html",
  styleUrls: ["./variant.component.scss"],
})
export class VariantComponent implements OnChanges {
  @Input()
  set businessModel(businessModel: BusinessModelConfig) {
    this._businessModel = businessModel;
    this.friendlyProtection = businessModel.protection * 100;
    this.init();
  }
  get businessModel(): BusinessModelConfig {
    return this._businessModel;
  }

  @Input()
  set meta(meta) {
    this._meta = meta;
    this.init();
  }
  get meta(): Meta {
    return this._meta;
  }

  get recommendation() {
    return AppComponent.recommendation?.friendlyName;
  }

  get feeing() {
    return VariantComponent.feeing;
  }

  set feeing(feeing) {
    VariantComponent.feeing = feeing;
  }

  private _businessModel;
  private _meta: Meta;
  friendlyProtection;

  hidden;

  /* variants */
  infections;
  totalDaysOff;
  totalCostDueSick;
  suggestedAmountDevices = 1;
  static feeing = "monthly";
  prices = {
    B: new SubscriptionModels(),
    W: new SubscriptionModels(),
    M: new SubscriptionModels(),
    Y: new SubscriptionModels(),
  };
  savings = 0;
  ROIBuy = 0;

  option;

  rentings = [
    { title: "Buy once", type: "B" },
    { title: "Rent yearly", type: "Y" },
    { title: "Rent monthly", type: "M" },
    { title: "Rent weekly", type: "W" },
  ];

  ngOnChanges(): void {
    this.init();
  }

  selectOption(rentingType) {
    this.option = rentingType;
  }

  private getInfections(individuals, cleaningEffect): number {
    return Math.ceil(((100 - cleaningEffect) / 100) * individuals);
  }

  private getDevices(roomCubic, power) {
    const devices = Math.ceil(roomCubic / power);
    return devices;
  }

  private calculate(): void {
    if (this.businessModel.name === ("placeholder" as any)) {
      return;
    }
    this.totalDaysOff = this.infections * this.meta.daysOff;
    let totalCostDueSick = this.totalDaysOff * this.meta.costDay;
    this.totalCostDueSick = totalCostDueSick;
    if (this.businessModel.name === "NOTHING") {
      AppComponent.benchmark = {
        totalCosts: this.totalCostDueSick,
        totalMissing: this.totalDaysOff,
      };
    } else {
      // calcualte amount devices
      if (this.businessModel.device?.power > 0) {
        const suggestedDevicesPerRoom = this.getDevices(
          this.meta.roomVolume,
          this.businessModel.device?.power
        );
        this.suggestedAmountDevices =
          suggestedDevicesPerRoom * this.meta.amountRooms;

        // ROIBuy
        const price =
          this.suggestedAmountDevices * this.businessModel.device.price;
        this.savings =
          AppComponent.benchmark.totalCosts - price - this.totalCostDueSick;

        this.prices.B.yearly = price / AppComponent.HaaSOptions.depletion;
        this.prices.B.monthly = Math.ceil(this.prices.B.yearly / 12);
        this.prices.B.weekly = Math.ceil(this.prices.B.monthly / 4);

        this.prices.B.savings =
          AppComponent.benchmark.totalCosts - price - this.totalCostDueSick;
        this.prices.B.roi = this.prices.B.savings / price;

        this.ROIBuy = this.savings / price;

        const recommendation: Recommendation = {
          ...this.businessModel,
          savings: this.savings,
          ROIBuy: this.ROIBuy,
        };

        AppComponent.recommendations.push(recommendation);
      }
    }
  }

  private calculateHaaS(): void {
    if (!this.businessModel?.device?.price) {
      return;
    }
    const price = this.suggestedAmountDevices * this.businessModel.device.price;
    const yearlyRevenue = roundToTenths(
      (price * AppComponent.HaaSOptions.yearly) /
        AppComponent.HaaSOptions.depletion
    );
    const monthlyRevnue = roundToTenths(
      (price * AppComponent.HaaSOptions.monthly) /
        AppComponent.HaaSOptions.depletion
    );
    const weeklyRevnue = roundToTenths(
      (price * AppComponent.HaaSOptions.weekly) /
        AppComponent.HaaSOptions.depletion
    );

    this.prices.Y.yearly = yearlyRevenue;
    this.prices.Y.monthly = Math.ceil(this.prices.Y.yearly / 12);
    this.prices.Y.weekly = Math.ceil(this.prices.Y.monthly / 4);

    this.prices.Y.savings =
      AppComponent.benchmark.totalCosts -
      yearlyRevenue * AppComponent.HaaSOptions.depletion -
      this.totalCostDueSick;
    this.prices.Y.roi =
      this.prices.Y.savings /
      (yearlyRevenue * AppComponent.HaaSOptions.depletion);

    this.prices.M.yearly = monthlyRevnue;
    this.prices.M.monthly = Math.ceil(this.prices.M.yearly / 12);
    this.prices.M.weekly = Math.ceil(this.prices.M.monthly / 4);

    this.prices.M.savings =
      AppComponent.benchmark.totalCosts -
      monthlyRevnue * AppComponent.HaaSOptions.depletion -
      this.totalCostDueSick;
    this.prices.M.roi =
      this.prices.M.savings /
      (monthlyRevnue * AppComponent.HaaSOptions.depletion);

    this.prices.W.yearly = weeklyRevnue;
    this.prices.W.monthly = Math.ceil(this.prices.W.yearly / 12);
    this.prices.W.weekly = Math.ceil(this.prices.W.monthly / 4);

    this.prices.W.savings =
      AppComponent.benchmark.totalCosts -
      weeklyRevnue * AppComponent.HaaSOptions.depletion -
      this.totalCostDueSick;
    this.prices.W.roi =
      this.prices.W.savings /
      (weeklyRevnue * AppComponent.HaaSOptions.depletion);
  }

  private init(): void {
    if (!this.meta || !this.businessModel) {
      return;
    }
    this.infections = this.getInfections(
      this.meta.people,
      this.friendlyProtection
    );
    this.calculate();
    this.calculateHaaS();
    this.hidden =
      this.businessModel.name === "NOTHING" ||
      this.businessModel.name === "FFP2_MASK" ||
      this.businessModel.name === "REGULAR_MASK";
  }
}

function roundToTenths(x) {
  return Math.ceil(x / 10) * 10;
}

class SubscriptionModels {
  yearly: number;
  monthly: number;
  weekly: number;
  savings: number;
  roi: number;
}
