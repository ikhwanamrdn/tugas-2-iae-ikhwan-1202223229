from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

inventory = []
id_counter = 1

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    return jsonify(inventory)

@app.route('/api/inventory', methods=['POST'])
def add_item():
    global id_counter
    data = request.json
    if not all(key in data for key in ('name', 'stock', 'category')):
        return jsonify({'error': 'Field tidak lengkap'}), 400

    new_item = {
        "id": id_counter,
        "name": data['name'],
        "stock": data['stock'],
        "category": data['category']
    }
    inventory.append(new_item)
    id_counter += 1
    return jsonify(new_item), 201

@app.route('/api/inventory/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    for item in inventory:
        if item['id'] == item_id:
            item['name'] = data.get('name', item['name'])
            item['stock'] = data.get('stock', item['stock'])
            item['category'] = data.get('category', item['category'])
            return jsonify(item)
    return jsonify({'error': 'Item tidak ditemukan'}), 404

@app.route('/api/inventory/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    global inventory
    inventory = [item for item in inventory if item['id'] != item_id]
    return jsonify({'message': 'Item berhasil dihapus'}), 200

if __name__ == '__main__':
    app.run(debug=True)