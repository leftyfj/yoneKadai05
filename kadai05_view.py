#開始
import eel

import traceback
import os

import functions
from possystem import Item
from possystem import Order
from possystem import ItemsMaster
from config import *

os.makedirs(os.path.dirname(TRANSACTION_FILE_PATH), exist_ok=True)
os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

global this_order
global item_master
global total_amount

@eel.expose
def get_item_master():
    global item_master
    item_master = ItemsMaster(ITEMS_MASTER_PATH).get_master()
    return item_master
  

@eel.expose
def show_order_detail():
    list, totalamount = Order(ITEMS_MASTER_PATH).make_order_detail()
    return list, totalamount

#Javascriptから呼び出したい関数です
@eel.expose
def add_order(item_code, quantity):
  # Order(ITEMS_MASTER_PATH).add_item_order(item_code, quantity)
  global this_order
  this_order.add_item_order(item_code, quantity)


@eel.expose
def show_order_detail_on_html():
  global total_amount
  order_list_detail, total_amount = this_order.make_order_detail()
  print(total_amount)
  print(order_list_detail)
  return total_amount, order_list_detail


@eel.expose
def order_checkout(deposit):
  global total_amount
  try:
    if len(deposit) == 0:
      text = '金額が未入力です。'
      eel.alertJs(text)
    else:
      deposit = int(deposit)
      change = deposit - total_amount
      if change <=0 :
        text = 'お買い上げ金額に足りません。'
        eel.alertJs(text)
      else:
        text = f'毎度ありがとうございます。\nお買い上げ金額{total_amount:,}円\nお預かり{deposit:,}円\nお釣りは{change:,}円です。'
        eel.alertJs(text)
  except:
    text = '入力に誤りがあります。確認して下さい。'
    eel.alertJs(text)
    
@eel.expose
def cancel_order():
  global this_order
  global total_amount
  this_order.cancel_order_all()
  total_amount = ''
    
### メイン処理
def main():
  global this_order
  global item_master
  global total_amount
  try:
    functions.make_log('開始')
    eel.init("web")
    
    #オーダークラスをインスタンス化
    functions.make_log('オーダー開始')
    
    this_order = Order(ITEMS_MASTER_PATH)
    
    eel.start("index.html", size=(600,600))

    
  except:           
    print('操作に誤りがありました。終了します。')
    functions.make_log('例外発生')
    functions.make_log(traceback.format_exc())

if __name__ == "__main__":
    main()
