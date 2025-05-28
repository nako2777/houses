# Railway Line and Station Crawler for BB.ielove.jp

This project contains scripts to crawl railway line and station data from BB.ielove.jp.

## Scripts

1. `crawler_prefecture_lines.py` - Fetches railway lines for all 47 prefectures in Japan
2. `crawler_line_stations.py` - Fetches stations for each railway line

## How to Use

### Step 1: Set up your cookie

Before running either script, you need to add your cookie to access BB.ielove.jp:

1. Log in to BB.ielove.jp
2. Open your browser's developer tools (F12)
3. Go to the Network tab
4. Make a request on the website
5. Find a request to the site, click on it and copy the Cookie value from the request headers
6. Paste the cookie into the `cookie` variable in both script files

### Step 2: Run the scripts in order

1. First, run the prefecture lines crawler:
   ```
   python crawler_prefecture_lines.py
   ```
   This creates a `prefecture_lines.json` file containing all railway lines by prefecture.

2. Next, run the line stations crawler:
   ```
   python crawler_line_stations.py
   ```
   This creates a `line_stations.json` file containing all stations for each railway line.

## Output Format

### prefecture_lines.json
```json
{
  "1": [
    {
      "line_id": "1234",
      "line_name": "Example Line"
    },
    ...
  ],
  "2": [
    ...
  ]
}
```

### line_stations.json
```json
{
  "Example Line": {
    "line_id": "1234",
    "stations": {
      "Station Name 1": "5678",
      "Station Name 2": "5679"
    }
  },
  ...
}
```
