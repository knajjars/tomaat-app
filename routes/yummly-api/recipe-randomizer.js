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
}

module.exports = RandomQuery;
