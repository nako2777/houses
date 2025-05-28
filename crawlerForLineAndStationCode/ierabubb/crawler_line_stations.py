import requests
import json
import time

# Add your cookie here
cookie = ""  # Fill in your cookie here

def fetch_stations_by_line(line_id):
    """
    Fetch stations for a specific railway line
    
    Args:
        line_id (str): Line ID
    
    Returns:
        list: Station data for the line
    """
    url = f"https://bb.ielove.jp/ielovebb/rentshareajax/getstationsbyline/{line_id}/"
    headers = {
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching stations for line {line_id}: {e}")
        return None

def main():
    # Load the lines data
    try:
        with open("prefecture_lines.json", "r", encoding="utf-8") as f:
            prefecture_lines = json.load(f)
    except FileNotFoundError:
        print("prefecture_lines.json not found. Please run crawler_prefecture_lines.py first.")
        return

    results = {}
    
    # Process each prefecture
    for prefecture_id, lines in prefecture_lines.items():
        print(f"Processing prefecture ID {prefecture_id}...")
        
        # Process each line in the prefecture
        for line in lines:
            line_id = line.get("line_id")
            line_name = line.get("line_name")
            
            if line_id:
                print(f"Fetching stations for line: {line_name} (ID: {line_id})")
                stations = fetch_stations_by_line(line_id)
                
                if stations:
                    results[line_name] = {
                        "line_id": line_id,
                        "stations": {station["station_name"]: station["station_id"] for station in stations}
                    }
                    print(f"Found {len(stations)} stations for line {line_name}")
                else:
                    print(f"No stations found for line {line_name}")
                
                # Add delay to avoid overwhelming the server
                time.sleep(1)
    
    # Save results to file
    with open("line_stations.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
    
    print("Data collection complete. Saved to line_stations.json")

if __name__ == "__main__":
    if not cookie:
        print("Please set your cookie in the script before running")
    else:
        main()
