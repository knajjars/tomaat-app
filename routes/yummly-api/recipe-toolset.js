const MetaData = require("./metadata");

class RandomQuery {
  constructor() {
    this.cuisinesArr = MetaData.cuisine;
  }

  getRandomCuisine() {
    const randomIndex = Math.floor(Math.random() * this.cuisinesArr.length);
    return [this.cuisinesArr[randomIndex]];
  }

  getRandomIndex() {
    return Math.floor(Math.random() * 2000);
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }
}

module.exports = RandomQuery;
