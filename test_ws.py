import asyncio
import websockets
import json

async def test_ais():
    uri = "wss://stream.aisstream.io/v0/stream"
    try:
        async with websockets.connect(uri) as websocket:
            sub = {
                "Apikey": "2592f9c9ab177b85ed30b95a5ee3a42309338da5",
                "BoundingBoxes": [[[-90, -180], [90, 180]]],
                "FiltersShipMMSI": ["371305000"],
                "FilterMessageTypes": ["PositionReport"]
            }
            await websocket.send(json.dumps(sub))
            print("Connected and subscribed. Waiting for 10 seconds for any data...")
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                print("Received:", message)
            except asyncio.TimeoutError:
                print("No data received within 10 seconds.")
    except Exception as e:
        print("Error:", e)

asyncio.run(test_ais())
