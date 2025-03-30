import axios from "axios";
import { authenticateUser } from "../services/authService";
import { useStore } from "../store";

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

      // Initialize the line Map if it doesn't exist
      this.initLineMap();
    } catch (error) {
      console.error("Error initializing Itandibb:", error);
      throw error;
    }
  }

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
        import.meta.env.VITE_ITTANDIBB_GETLINE_API,{
            params: {
              line_name: "線",
            },
        }  
      );
      const data = response.data;
      console.log(data);
      // Assuming the API returns station data in a structured format
      // const stationNames = data.station_list.map(station => station.station_name);
      // return stationNames;
    } catch (error) {
      console.error("Error initializing line map:", error);
      throw error;
    }
  }  
}
