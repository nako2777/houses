import all_stations from "../data/all_stations.json";
export default class {
  constructor() {
    this.lines = [];
    for (const line in all_stations) {
      this.lines.push(line);
    }
  }

  getLines() {
    return this.lines;
  }

  getStations(line) {
    return all_stations[line];
  }
}
