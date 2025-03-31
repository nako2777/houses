import requests
import json
import time

# Add your cookie here
# 每次用的时候手动更新个能用的
cookie = "_cloud_chintai_base_session=%2BWuoakYDZZs%2FNs0IDv7Qx2FV8cO7%2Bd1eDNnxAi5ANrMnms8jN%2FIYr18CCZBnlf%2BSqet0xIUT%2B41JUCeQaUK39l0DIYPoQSPYdw0v%2BM6r7XA%2BHiBtrRP3NV0H1vSvEr3FOh7iPEfWXF2qw9AtTzosu3shACAj3TrR7qNnpsetE6jSr1bp3%2B1wByMHlJz6FasW5%2Bgo2ddfJO%2Foamj37UAzRBPFFcY1e6d1eBIiLTTIpgxbTd%2FvXC7aHlmbSFpVjI2ATPgnI1RWXdr3jpF3HuUTq0PAGNaF928NTPtaFhmtFZfl8ApcZPgSl3ioD4KlDCXcnMfdL%2FVD%2B5%2BvWxka%2FhLtnWZ9f9QhrmHpFlP7LvUvnUKwM4FELuDHroIWsUnNONTwp6%2FNsnCGHhLk4yDtERz6i6LWH8cGHrwcTgFfbwytrzUZt1d%2F3rkqNPdRLA%3D%3D--nuf7RfFVRdE%2B%2B8Fu--sj0Irm%2BfJSga0ww8DNN7Dg%3D%3D"

def fetch_line(line_name):
    url = "https://api.itandibb.com/api/internal/stations/lines"
    params = {"line_name": line_name}
    headers = {
        "Cookie": cookie
    }
    response = requests.get(url, params=params, headers=headers)
    data = response.json()
    return {item["label"]: item["id"] for item in data}

def fetch_stations(line_name, line_id):
    url = "https://api.itandibb.com/api/internal/lines/" + line_id + "/stations"
    headers = {
        "Cookie": cookie
    }
    response = requests.get(url, headers=headers)
    stations = response.json()["stations"]
    return {station["label"]: station["id"] for station in stations}

# Main logic to fetch and save data
line_name = "線"
lines_data = fetch_line(line_name)
result = {}

# 保存所有的线路信息
for i, (label, line_id) in enumerate(lines_data.items(), start=1):
    print(f"第 {i} 次请求：{label} (line_id={line_id})")
    stations = fetch_stations(label, str(line_id))
    result[label] = {
        "line_id": line_id,
        "stations": stations
    }
    time.sleep(0.5)  # Sleep to avoid hitting the server too hard

# Save the result to a JSON file
with open("stations.json", "w", encoding="utf-8") as json_file:
    json.dump(result, json_file, ensure_ascii=False, indent=4)

print("Data saved to stations.json")
