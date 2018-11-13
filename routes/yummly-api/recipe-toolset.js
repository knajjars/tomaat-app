const MetaData = require("./metadata");

class RandomQuery {
  constructor() {
    this.cuisinesArr = MetaData.cuisine;
  }

  getRandomCuisine() {
    const randomIndex = Math.floor(Math.random() * this.cuisinesArr.length);
    return [this.cuisinesArr[randomIndex]];
  }

  getRandomIndex(num) {
    return Math.floor(Math.random() * num);
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " h " : " h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

module.exports = RandomQuery;
