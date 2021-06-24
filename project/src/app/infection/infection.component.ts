import { AfterViewInit, Component, Input } from "@angular/core";
import { AppComponent } from "../app.component";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "mvp-infection",
  templateUrl: "./infection.component.html",
  styleUrls: ["./infection.component.scss"],
})
export class InfectionComponent implements AfterViewInit {
  faTimes = faTimes;

  @Input()
  set people(people) {
    this.amountPeople = Array(people)
      .fill(0)
      .map((x, i) => i);
  }

  @Input()
  protection: number;

  @Input()
  set infections(infections) {
    this._infections = infections;
  }

  get infections() {
    return this._infections;
  }

  id = ("infections_" + Math.random() + "_" + Math.random())
    .replace(".", "")
    .replace(".", "");

  private _infections: number;
  amountPeople: number[] = [];

  ngAfterViewInit(): void {
    const selector = `.${this.id} .person`;
    const persons = document.querySelectorAll(selector);
    const shuffeld = shuffle(Array.from(persons));

    if (AppComponent.perspective === "HEALTH") {
      const container = document.querySelector(`.${this.id}`);
      container.classList.add("health-perspective");
    }

    for (let i = 0; i < this.infections; i++) {
      if (shuffeld[i]) {
        shuffeld[i].classList.add("infected");
      }
    }
  }
}

function shuffle(list) {
  return list.reduce((p, n) => {
    const size = p.length;
    const index = Math.trunc(Math.random() * (size - 1));
    p.splice(index, 0, n);
    return p;
  }, []);
}
