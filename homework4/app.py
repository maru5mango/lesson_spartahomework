from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017)
db = client.bunny

## HTML을 주는 부분
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/order', methods=['POST'])
def write_order():
    name=request.form['name']
    t_order=request.form['t_order']
    b_order=request.form['b_order']
    t_count=request.form['t_count']
    b_count=request.form['b_count']
    email=request.form['email']
    addr=request.form['addr1']
    tel=request.form['tel']

    order = {
        'name':name,
        't_order':t_order,
        'b_order':b_order,
        't_count':t_count,
        'b_count':b_count,
        'email':email,
        'addr':addr,
        'tel':tel
    }

    db.order.insert_one(order)
    return jsonify({'result': 'success', 'msg': '주문을 완료했습니다.'})


@app.route('/order', methods=['GET'])
def read_order():
    order_list= list(db.order.find({}, {'_id': False}))
    return jsonify({'result': 'success', 'order_list': order_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=1000, debug=True)
