import requests
from bs4 import BeautifulSoup
import json
import time
import re

class IeloveCrawler:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "content-type": "application/x-www-form-urlencoded"
        }
        # You can add your cookie here if needed
        self.cookie = """_ga=GA1.1.1666330284.1743689303; cloud_type_code=0; PHPSESSID=t0k84eotokfskm9b19tm3ot4e0; _193399683b35b83d61e97d51977e5cb6=237bf0db8909cc663d941d1edfa99451; _ga_MJ2WKWC354=GS2.1.s1748437347$o2$g1$t1748437370$j37$l0$h0; AWSALB=Rfe4Uptnjf1zwRZkb67SBGVragrMw5jyyngr37J4zEIxw7TwEhDUfzpjKR1UpgBsXci+i4cwvWHKu8obiT029pTpFKe9pXNNySWTR+c2TFpa2T/qosXWw9Io3KR4; AWSALBCORS=Rfe4Uptnjf1zwRZkb67SBGVragrMw5jyyngr37J4zEIxw7TwEhDUfzpjKR1UpgBsXci+i4cwvWHKu8obiT029pTpFKe9pXNNySWTR+c2TFpa2T/qosXWw9Io3KR4"""
        if self.cookie:
            self.headers["Cookie"] = self.cookie

    def get_lines_by_prefecture(self, prefecture_code):
        """
        Get lines for a specific prefecture code from HTML response
        
        Args:
            prefecture_code (str): Prefecture code (e.g., '13' for Tokyo)
        
        Returns:
            dict: Dictionary of line names to line codes
        """
        url = 'https://bb.ielove.jp/ielovebb/rentshareajax/getlinebytodofuken/'
        data = {
            'todofuken[]': prefecture_code
        }
        
        try:
            print(f"Sending POST request to {url} with data: {data}")
            response = requests.post(url, data=data, headers=self.headers)
            response.raise_for_status()
            print(f"Response status: {response.status_code}")
            print(f"Response content preview: {response.text[:300]}...")
        except requests.exceptions.RequestException as e:
            print(f"Error fetching prefecture {prefecture_code}: {e}")
            return {}
        
        # Parse HTML response
        soup = BeautifulSoup(response.text, 'html.parser')
        lines = {}
        
        # Extract line information from checkboxes
        line_elements = soup.select('input[type="checkbox"][name="line[]"]')
        print(f"Found {len(line_elements)} line elements")
        
        for element in line_elements:
            value = element.get('value')
            if '_' in value:
                prefecture, line_code = value.split('_')
                # Find the next span element which contains the line name
                line_name_span = element.find_next('span', class_='line_text')
                if line_name_span:
                    line_name = line_name_span.text.strip()
                    lines[line_name] = int(line_code)
                    print(f"Found line: {line_name} (code: {line_code})")
        
        return lines

    def get_stations_by_line(self, prefecture_code, line_code):
        """
        Get stations for a specific line from HTML response
        
        Args:
            prefecture_code (str): Prefecture code
            line_code (str): Line code
        
        Returns:
            dict: Dictionary of station names to station codes
        """
        url = 'https://bb.ielove.jp/ielovebb/rentshareajax/getstationbylinecode/'
        data = {
            'line': line_code,
            'todofuken': prefecture_code
        }
        
        try:
            print(f"Sending POST request to {url} with data: {data}")
            response = requests.post(url, data=data, headers=self.headers)
            response.raise_for_status()
            print(f"Response status: {response.status_code}")
            print(f"Response content preview: {response.text[:300]}...")
        except requests.exceptions.RequestException as e:
            print(f"Error fetching stations for prefecture {prefecture_code}, line {line_code}: {e}")
            return {}
        
        # Parse HTML response
        soup = BeautifulSoup(response.text, 'html.parser')
        stations = {}
        
        # Extract station information from checkboxes
        # Format: <input type="checkbox" value="13_1_5" name="station[]" id="station-13_1_5">
        station_elements = soup.select('input[type="checkbox"][name="station[]"]')
        print(f"Found {len(station_elements)} station elements")
        
        for element in station_elements:
            value = element.get('value')
            # Value format is like "13_1_5" where 13 is prefecture, 1 is line, 5 is station
            if value and value.count('_') == 2:
                prefecture, line, station_code = value.split('_')
                # Find the next span which contains the station name
                station_name_span = element.find_next('span', class_='station_text')
                if station_name_span:
                    station_name = station_name_span.text.strip()
                    stations[station_name] = int(station_code)
                    print(f"Found station: {station_name} (code: {station_code})")
        
        return stations

    def crawl_all_stations(self, prefecture_codes):
        """
        Crawl all lines and stations for given prefecture codes
        
        Args:
            prefecture_codes (list): List of prefecture codes to crawl
        
        Returns:
            dict: Dictionary in the format {line_name: {line_id: xxx, stations: {station_name: station_id}}}
        """
        all_stations = {}
        
        for prefecture_code in prefecture_codes:
            print(f"Getting lines for prefecture {prefecture_code}")
            lines = self.get_lines_by_prefecture(prefecture_code)
            
            for line_name, line_code in lines.items():
                print(f"Getting stations for line: {line_name} (code: {line_code})")
                stations = self.get_stations_by_line(prefecture_code, str(line_code))
                
                all_stations[line_name] = {
                    "line_id": line_code,
                    "stations": stations
                }
                
                # Be nice to the server with a small delay
                time.sleep(0.5)
        
        return all_stations

def main():
    crawler = IeloveCrawler()
    
    # List of prefecture codes to crawl
    # You can add all prefecture codes (01-47) or just test with a few
    prefecture_codes = ['13']  # Example: Tokyo only
    
    # For all prefectures, uncomment the following line:
    # prefecture_codes = [f"{i:02d}" for i in range(1, 48)]
    
    all_stations = crawler.crawl_all_stations(prefecture_codes)
    
    # Save results to JSON file
    output_file = 'ielovebb_stations.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_stations, f, ensure_ascii=False, indent=4)
    
    print(f"Crawling completed. Total lines: {len(all_stations)}")
    print(f"Data saved to {output_file}")
    
    if all_stations:
        # Print a sample of the data
        sample_line = next(iter(all_stations.items()))
        print(f"\nSample data for {sample_line[0]}:")
        print(json.dumps(sample_line[1], ensure_ascii=False, indent=2)[:500] + "...")

if __name__ == "__main__":
    main()
