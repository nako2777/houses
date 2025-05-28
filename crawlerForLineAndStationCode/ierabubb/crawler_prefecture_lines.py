import requests
import json
import time

# Add your cookie here
cookie = ""  # Fill in your cookie here

def fetch_lines_by_prefecture(prefecture_id):
    """
    Fetch railway lines for a specific prefecture
    
    Args:
        prefecture_id (int): Prefecture ID (1-47)
    
    Returns:
        dict: Line data for the prefecture
    """
    url = "https://bb.ielove.jp/ielovebb/rentshareajax/getlinebytodofuken/"
    headers = {
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    params = {
        "todofuken": str(prefecture_id)
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching prefecture {prefecture_id}: {e}")
        return None

def main():
    results = {}
    
    # Loop through all prefectures (1-47)
    for prefecture_id in range(1, 48):
        print(f"Fetching lines for prefecture ID {prefecture_id}...")
        data = fetch_lines_by_prefecture(prefecture_id)
        
        if data:
            results[prefecture_id] = data
            print(f"Found {len(data)} lines for prefecture {prefecture_id}")
        else:
            print(f"No data found for prefecture {prefecture_id}")
        
        # Add delay to avoid overwhelming the server
        time.sleep(1)
    
    # Save results to file
    with open("prefecture_lines.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
    
    print("Data collection complete. Saved to prefecture_lines.json")

if __name__ == "__main__":
    if not cookie:
        print("Please set your cookie in the script before running")
    else:
        main()
