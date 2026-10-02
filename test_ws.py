import asyncio
import websockets
import json

async def test_ais():
    uri = "wss://stream.aisstream.io/v0/stream"
    try:
        async with websockets.connect(uri) as websocket:
            sub = {
                "Apikey": "2592f9c9ab177b85ed30b95a5ee3a42309338da5",
                "BoundingBoxes": [[[-90, -180], [90, 180]]]
            }
            await websocket.send(json.dumps(sub))
            print("Connected. Waiting for global data...")
            try:
                for i in range(5):
                    message = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    print(f"Received {i+1}:", message[:200])
            except asyncio.TimeoutError:
                print("No data received.")
    except Exception as e:
        print("Error:", e)

asyncio.run(test_ais())
