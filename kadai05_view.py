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

  
@eel.expose
def get_item_master():
    item_master = ItemsMaster(ITEMS_MASTER_PATH).get_master()
    return item_master
  

@eel.expose
def show_order_detail():
    list, totalamount = Order(ITEMS_MASTER_PATH).make_order_detail()
    return list, totalamount


@eel.expose
def add_order(item_code, quantity):
  # Order(ITEMS_MASTER_PATH).add_item_order(item_code, quantity)
  order_name.add_item_order(item_code, quantity)
  print(item_code, quantity)


### メイン処理
def main():
  try:
    functions.make_log('開始')
    eel.init("web")
    eel.start("index.html", size=(600,600))

  except:           
    print('操作に誤りがありました。終了します。')
    functions.make_log('例外発生')
    functions.make_log(traceback.format_exc())

if __name__ == "__main__":
    main()
