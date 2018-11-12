class RandomQuery {
  constructor() {
    this.cuisinesArr = "American, Italian, Asian, Mexican, Southern & Soul Food, French, Southwestern, Barbecue, Indian, Chinese, Cajun & Creole, English, Mediterranean, Greek, Spanish, German, Thai, Moroccan, Irish, Japanese, Cuban, Hawaiin, Swedish, Hungarian, Portugese".split(
      ", "
    );
  }

  getRandomCuisine() {
    const randomIndex = Math.floor(Math.random() * this.cuisinesArr.length);
    return [this.cuisinesArr[randomIndex]];
  }

  getRandomIndex() {
    return Math.floor(Math.random() * 5000);
  }
}

module.exports = RandomQuery;
