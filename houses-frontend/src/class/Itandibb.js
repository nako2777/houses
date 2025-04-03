import axios from "axios";
import { authenticateUser } from "../services/authService";
import staionsMap from "../data/itandibb/stationsMap";
import { useStore } from "../store";
//labelToId is a object
import labelToId from "../data/itandibb/label_to_id";
export default class Itandibb {
  constructor() {
    this.csrfToken = null;
    this.api = null;
  }

  async init() {
    try {
      this.csrfToken = await authenticateUser();

      // Initialize Axios instance with CSRF token
      this.createAxiosInstance();

      //开发的时候测试数据用
      this.forDevelopTest();

      // Initialize the line Map if it doesn't exist
      // this.initLineMap();
    } catch (error) {
      console.error("Error initializing Itandibb:", error);
      throw error;
    }
  }

  async forDevelopTest() {
    // this.getStations(1278);
    // this.getHouses()
  }


  async search(conditions){
    conditions.stationsCode = this.getStationsCode(conditions.line,conditions.stations)
    const data = await this.getHouses(conditions)
    return data;
  }

  getStationsCode(line,stations){
    const tmp = []
    for(const station of stations){
      const stationCode = staionsMap[line].stations[station]
      if(stationCode){
        tmp.push(stationCode)
      }else{
        console.error("Station code not found for: ", station)
      }
    }

    return tmp;
  }

  async getStations(lineCode) {
    try {
      const response = await this.api.get(
        import.meta.env.VITE_ITTANDIBB_LINES_API + "/" + lineCode + "/stations"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching stations:", error);
      throw error;
    }
  }

  async getHouses(conditions) {
    try {
      const response = await this.api.post(
        import.meta.env.VITE_ITTANDIBB_HOUSES_SEARCH_API,
        {
          filter: {
            "station_id:in": conditions.stationsCode,
            ...(conditions.priceMin != "" && { "rent:gteq": parseInt(conditions.priceMin) }),
            ...(conditions.priceMax != "" && { "rent:lteq": parseInt(conditions.priceMax) }),
          },
          sort: [{ last_status_opened_at: "desc" }],
          page: { page: 1, limit: 20 },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching houses:", error);
      throw error;
    }
  }

  async searchHouses() {}

  createAxiosInstance() {
    this.api = axios.create({
      withCredentials: true, // Include cookies in requests
    });

    // Set up request interceptor to include CSRF token in headers
    this.api.interceptors.request.use(
      (config) => {
        config.headers["X-CSRF-Token"] = this.csrfToken;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    console.log("Axios instance created and configured.");
  }

  async initLineMap() {
    try {
      const response = await this.api.get(
        import.meta.env.VITE_ITTANDIBB_GETLINE_API,
        {
          params: {
            line_name: "線",
          },
        }
      );
      const data = response.data;
      // Assuming the API returns station data in a structured format
      // const stationNames = data.station_list.map(station => station.station_name);
      // return stationNames;
    } catch (error) {
      console.error("Error initializing line map:", error);
      throw error;
    }
  }
}
