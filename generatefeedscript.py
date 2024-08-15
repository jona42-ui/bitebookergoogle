import time
from datetime import datetime, timedelta
import random
import json

def generate_availability_feed():
    merchants = ["5411897448"]
    services = ["res_01", "res_02"]
    availability_feed = {
        "metadata": {
            "processing_instruction": "PROCESS_AS_COMPLETE",
            "shard_number": 0,
            "total_shards": 1,
            "nonce": str(random.randint(10000000, 99999999)),
            "generation_timestamp": int(time.time())  # current UTC time in Unix epoch
        },
        "service_availability": []
    }

    start_date = datetime(2024, 8, 16)
    end_date = start_date + timedelta(days=30)

    for merchant_id in merchants:
        availability = []
        current_date = start_date
        while current_date <= end_date:
            if current_date.weekday() in [4, 5, 6]:  # Friday, Saturday, Sunday
                for hour in range(18, 24):  # 6 PM to 12 AM
                    if current_date.weekday() == 6 and hour == 23:
                        continue  # On Sunday, only go until 11 PM
                    for service_id in services:
                        total_spots = random.randint(1, 20)
                        open_spots = random.randint(0, total_spots)
                        start_sec = int(datetime(
                            current_date.year, 
                            current_date.month, 
                            current_date.day, 
                            hour, 0).timestamp())
                        availability.append({
                            "spots_total": total_spots,
                            "spots_open": open_spots,
                            "duration_sec": 3600,
                            "service_id": service_id,
                            "start_sec": start_sec,
                            "merchant_id": merchant_id,
                            "resources": {
                                "party_size": random.randint(1, 10)
                            },
                            "confirmation_mode": "CONFIRMATION_MODE_SYNCHRONOUS"
                        })
            current_date += timedelta(days=1)
        availability_feed["service_availability"].append({
            "availability": availability
        })

    # Output to a JSON file
    with open('availability-feed2.json', 'w') as file:
        json.dump(availability_feed, file, indent=4)

if __name__ == "__main__":
    generate_availability_feed()
