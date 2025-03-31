import axios from 'axios';

export default {
    init: async function() {
        const response = await axios.get('https://api.itandibb.com/api/internal/stations/lines?line_name=%E7%B7%9A');
        const data = response.data;
        console.log(data)
        // Assuming the API returns station data in a structured format
        // const stationNames = data.station_list.map(station => station.station_name);
        // return stationNames;
    }
}
