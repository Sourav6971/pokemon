from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  


tiles = [
    {"tile_number": i, "file_name": f"http://127.0.0.1:5000/assets/pokemon_image/tile_image_{i}.png"}
    for i in range(1, 17)
]
random.shuffle(tiles)


@app.route('/get_tiles', methods=['GET'])
def get_tiles():
    return jsonify(tiles)

@app.route('/assets/pokemon_image/<path:filename>', methods=['GET'])
def serve_images(filename):
    return send_from_directory('assets/pokemon_image', filename)

if __name__ == '__main__':
    app.run(debug=True)
