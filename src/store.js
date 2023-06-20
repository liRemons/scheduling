import { makeAutoObservable } from "mobx";

class Store {
  menu = {};
  constructor() {
    makeAutoObservable(this);
  }

  changeMenu(val) {
    this.menu = val;
  }
}

const store = new Store();

export default store;
