import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { Settings } from "./settings/settings.component";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  static perspective: "HEALTH" | "SICK" = "HEALTH";
  static benchmark: Benchmark;
  static recommendations: Recommendation[] = [];
  static recommendation: Recommendation;
  static HaaSOptions: HaaSOptions;
  firstloaded = false;
  perspecitveClass = "mvp-perspective-sick";

  public readonly CONFIG: BusinessModelConfig[] = [
    {
      name: "placeholder" as any,
      friendlyName: "",
      protection: -1,
    },
    {
      name: BusinessModel.NOTHING,
      friendlyName: "No Protection",
      protection: 0.3,
    },
    {
      name: BusinessModel.REGULAR_MASK,
      friendlyName: "Regular Mask",
      protection: 0.5,
    },
    {
      name: BusinessModel.FFP2_MASK,
      friendlyName: "FFP2 Mask",
      protection: 0.9,
    },
  ];

  config = [];

  meta: Meta = {
    people: 48,
    costDay: 1000,
    daysOff: 3,
    perspective: "HEALTH",
    roomVolume: 10,
    amountRooms: 1,
  };

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly http: HttpClient
  ) {}

  private getConfig(jsonURL): Promise<Device[] | HaaSOptions> {
    return new Promise((resolve) => {
      this.http
        .get<APIResponse>(jsonURL)
        .toPromise()
        .then((response) => {
          resolve(response.data);
        });
    });
  }

  ngOnInit(): void {
    this.config = this.CONFIG;
    setTimeout(async () => {
      const haasOptions = (await this.getConfig(
        "./../../assets/config/haas.json"
      )) as HaaSOptions;
      AppComponent.HaaSOptions = haasOptions;
      const devices = (await this.getConfig(
        "./../../assets/config/devices.json"
      )) as Device[];
      devices.forEach((device: Device) => {
        this.config.push({
          name: BusinessModel.STERI_AIR,
          friendlyName: device.name,
          protection: 0.99,
          device: device,
        });
      });
    });
  }

  ngAfterViewInit(): void {
    const placeholderVariant = document.querySelector(".variant-0");
    placeholderVariant.classList.add("placeholder");
  }

  settingsChanged(settings: Settings): void {
    this.firstloaded = true;
    this.config = [];
    AppComponent.perspective = settings.perspective;
    AppComponent.recommendations = [];
    this.perspecitveClass = `mvp-perspective-${AppComponent.perspective.toLocaleLowerCase()}`;
    this.meta = {
      people: settings.amountPeople,
      costDay: settings.costDay,
      daysOff: settings.daysOff,
      perspective: AppComponent.perspective,
      roomVolume: settings.roomVolume,
      amountRooms: settings.amountRooms,
    };
    this.cdr.detectChanges();
    this.config = [...this.CONFIG];
    this.cdr.detectChanges();
    this.ngAfterViewInit();
    AppComponent.recommendations = AppComponent.recommendations
      .sort((a, b) => {
        if (a.savings > b.savings) {
          return 1;
        }
        if (a.savings < b.savings) {
          return -1;
        }
        return 0;
      })
      .reverse();
    AppComponent.recommendation = AppComponent.recommendations[0];
  }
}

export interface APIResponse {
  data: Device[] | HaaSOptions;
}

export interface BusinessModelConfig {
  name: BusinessModel;
  friendlyName: string;
  protection: number;
  device?: Device;
}

export enum BusinessModel {
  NOTHING = "NOTHING",
  REGULAR_MASK = "REGULAR_MASK",
  FFP2_MASK = "FFP2_MASK",
  STERI_AIR = "STERI_AIR",
}

export interface Meta {
  people: number;
  costDay: number;
  daysOff: number;
  perspective?: "HEALTH" | "SICK";
  roomVolume: number;
  amountRooms: number;
  hideInfections?: boolean;
}

export interface Benchmark {
  totalCosts: number;
  totalMissing: number;
  recommendations?: BusinessModelConfig;
}

export interface Recommendation extends BusinessModelConfig {
  ROIBuy: number;
  savings: number;
}

export interface Device {
  price: number;
  power: number;
  name: string;
}

export interface HaaSOptions {
  depletion: number;
  yearly: number;
  monthly: number;
  weekly: number;
}
