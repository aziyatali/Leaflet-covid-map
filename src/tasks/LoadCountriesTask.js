import papa from "papaparse";
import legendItems from "../entities/LegendItems";
import { features } from "../data/countries.json";
console.log(features);
class LoadCountryTask {
  covidUrl = "https://raw.githubusercontent.com/aziyatali/IV-Leaflet/main/src/data/owid-covid-data.csv";
   
  setState = null;

  load = (setState) => {
    this.setState = setState;
    papa.parse(this.covidUrl, {
      download: true,
      header: true,
      complete: (result) => this.#processCovidData(result.data),
    });
  };

  #processCovidData = (covidCountries) => {
    console.log("parsed data: ", covidCountries);
    for (let i = 0; i < features.length; i++) {
      const country = features[i];
      //console.log(country);
      const covidCountry = covidCountries.find(
        (covidCountry) => country.properties.ISO_A3 === covidCountry.iso_code
      );
      //console.log("covid_country: ", covidCountry);

      country.properties.confirmed = 0;
      country.properties.confirmedText = 0;

      if (covidCountry != null) {
        let confirmed = Number(covidCountry.total_cases);
        // console.log("CASE: ", confirmed);
        country.properties.confirmed = confirmed;
        country.properties.confirmedText = this.#formatNumberWithCommas(
          confirmed
        );
      }
      this.#setCountryColor(country);
    }

    this.setState(features);
  };

  #setCountryColor = (country) => {
    const legendItem = legendItems.find((item) =>
      item.isFor(country.properties.confirmed)
    );

    if (legendItem != null) country.properties.color = legendItem.color;
  };

  #formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
}

export default LoadCountryTask;