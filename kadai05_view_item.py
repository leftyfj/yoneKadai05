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
def check_duplicate(val):
  global item_master
  item_code_list = ItemsMaster(ITEMS_MASTER_PATH).get_item_code_list()
  if val in item_code_list:
    print(True)
    return True
  else:
    print(False)
    return False
    
    

### メイン処理
def main():
  
  try:
    functions.make_log('開始')
    eel.init("web")
    
    eel.start("item_admin.html", size=(900, 600))
  except:
    print('操作に誤りがありました。終了します。')
    functions.has_error()
  

if __name__ == "__main__":
    main()
