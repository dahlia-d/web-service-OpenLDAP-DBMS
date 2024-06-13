from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/data', methods=['GET'])
def get_data():
    data = {
        "message": "Hello from Flask!"
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
