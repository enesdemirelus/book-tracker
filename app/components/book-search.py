import requests
import json

book_name = "Kalbin Zumrut Tepeleri"
url = f"https://openlibrary.org/search.json?q={book_name.replace(' ', '+')}&limit=1"

data = requests.get(url).json()
print(json.dumps(data, indent=4))