import os
import subprocess

# Define variables
year_changes = 2021
month_changes = "09"
game_name = "among-us"
ext_changes = "jpg"
download_count = 8
# Create folder
os.makedirs(game_name, exist_ok=True)

# Change directory
os.chdir(game_name)

# Download files using aria2c
for counter in range(1, download_count + 1):
    https:///wp-content/uploads/2024/06/carx-street-2.webp
    url = f"https://modyolo.com/wp-content/uploads/{year_changes}/{month_changes}/{game_name}-{counter}.{ext_changes}"
    print(f"Downloading: {url}")
    subprocess.run(["aria2c", url])
