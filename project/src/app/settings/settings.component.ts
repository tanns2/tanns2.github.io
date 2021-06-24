import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
} from "@angular/core";
import { Component, Output } from "@angular/core";

const SETTINGS_LOCAL_STORAGE = "settings";

/**
 * @title Slider with custom thumb label formatting.
 */
@Component({
  selector: "mvp-settings",
  templateUrl: "settings.component.html",
  styleUrls: ["settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements AfterViewInit {
  @Output()
  settingsChanged = new EventEmitter<Settings>();
  settings: Settings;
  readonly defaultSettings: Settings = {
    amountPeople: 5,
    costDay: 1000,
    daysOff: 3,
    perspective: "SICK",
    health: true,
    roomVolume: 10,
    amountRooms: 1,
  };

  constructor(private readonly cdr: ChangeDetectorRef) {}

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "k";
    }

    return value;
  }

  update(): void {
    const settings: Settings = {
      amountPeople: this.settings.amountPeople,
      costDay: this.settings.costDay,
      daysOff: this.settings.daysOff,
      perspective: this.settings.health ? "HEALTH" : "SICK",
      roomVolume: this.settings.roomVolume,
      amountRooms: this.settings.amountRooms,
    };
    this.settingsChanged.emit(settings);
    localStorage.setItem(SETTINGS_LOCAL_STORAGE, JSON.stringify(settings));
  }

  reset(): void {
    this.settings = Object.assign({}, this.defaultSettings);
    this.update();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.settings = JSON.parse(localStorage.getItem(SETTINGS_LOCAL_STORAGE));
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.settings) {
        this.settings.health = true;
      } else {
        localStorage.setItem(
          SETTINGS_LOCAL_STORAGE,
          JSON.stringify(this.defaultSettings)
        );
        this.settings = Object.assign({}, this.defaultSettings);
      }
      this.update();
    }, 750);
  }
}

export interface Settings {
  amountPeople: number;
  costDay: number;
  daysOff: number;
  perspective: "HEALTH" | "SICK";
  health?: boolean;
  roomVolume: number;
  amountRooms: number;
}
