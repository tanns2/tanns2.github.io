import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { VariantComponent } from "./variant/variant.component";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from "@angular/material/badge";
import { InfectionComponent } from "./infection/infection.component";
import { SettingsComponent } from "./settings/settings.component";
import { FormsModule } from "@angular/forms";
import { ThousandsPipe } from "./thousands.pipe";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    VariantComponent,
    InfectionComponent,
    SettingsComponent,
    ThousandsPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    FormsModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    FontAwesomeModule,
    MatBadgeModule
  ],
  providers: [ThousandsPipe],
  bootstrap: [AppComponent, VariantComponent],
})
export class AppModule {}
