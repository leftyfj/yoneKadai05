#開始
import eel
import os
import sys
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

@eel.expose
def add_order(item_code, quantity):
  global this_order
  try:
    this_order.add_item_order(item_code, quantity)
  except:
    functions.has_error()

@eel.expose
def show_order_detail_on_html():
  global total_amount
  global order_list_detail
  order_list_detail, total_amount = this_order.make_order_detail()
  return total_amount, order_list_detail

@eel.expose
def order_checkout(deposit):
  global total_amount
  global order_list_detail
  try:
    change = deposit - total_amount
    if change < 0:
      text = f'お預かり金額が{-change}円不足しています。\n'
      eel.alertJs(text)
      return False
    else:
      text = f'毎度ありがとうございます。\nお買い上げ金額{total_amount:,}円\nお預かり{deposit:,}円\nお釣りは{change:,}円です。'
      eel.alertJs(text)
      make_transaction_log(order_list_detail, deposit, change)
      return True
  except:
    functions.has_error()
  
@eel.expose
def cancel_order():
  global this_order
  global total_amount
  this_order.cancel_order_all()
  total_amount = ''

@eel.expose
def init_order():
  global this_order
  this_order = Order(ITEMS_MASTER_PATH)
  
@eel.expose
def make_transaction_log(detail,deposit,change):
  with open(TRANSACTION_FILE_PATH, 'a', encoding='utf-8_sig', newline='\n') as file:
    print('商品コード,', '商品名,', '単価,', '数量,', '金額', file=file)
    for row in detail:
      file.write(",".join(str(_) for _ in row) + '\n')
    print(f'合計:{total_amount:,}円', file=file)
    print(f'入金:{deposit:,}円', file=file)
    print(f'釣り:{change:,}円' + '\n', file=file)

@eel.expose
def quit_program():
  functions.make_log('プログラムを終了しました。')
  sys.exit()
  
  
### メイン処理
def main():
  global this_order
  global item_master
  global total_amount
  global order_list_detail
  
  try:
    functions.make_log('開始')
    eel.init("web")
    
    #オーダークラスをインスタンス化
    functions.make_log('オーダー開始')
    
    this_order = Order(ITEMS_MASTER_PATH)
    
    eel.start("index.html", size=(900,600))

    
  except:     
    print('操作に誤りがありました。終了します。')
    functions.has_error()


if __name__ == "__main__":
    main()
