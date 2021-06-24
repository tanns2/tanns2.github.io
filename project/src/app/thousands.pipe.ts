import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "thousands" })
export class ThousandsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }
    if (parseInt(value.replace(",", "")) >= 100000) {
      return (Math.round(parseInt(value.replace(",", "")) / 1000) + "k") as any;
    }
    return value.replace(new RegExp(",", "g"), "'");
  }
}
