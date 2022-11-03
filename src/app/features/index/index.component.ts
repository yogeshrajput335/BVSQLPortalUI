import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  constructor() {
    this.companyName = environment.companyName;
  }
  companyName:any

  ngOnInit(): void {}
}
