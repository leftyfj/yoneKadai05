#開始
import eel

import traceback
import os

import functions
from possystem import Item
from possystem import Order
from possystem import ItemsMaster
from config import *


# eel.init("web")
# eel.start("index.html")

os.makedirs(os.path.dirname(TRANSACTION_FILE_PATH), exist_ok=True)
os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)


### メイン処理
def main():
  try:
    print(functions.get_current_datetime())
    functions.make_log('開始')
    
    @eel.expose
    def get_item_master():
      item_master =ItemsMaster(ITEMS_MASTER_PATH).get_master()
      return item_master
    
    eel.init("web")
    eel.start("index.html")
  except:
      print('操作に誤りがありました。終了します。')
      functions.make_log('例外発生')
      functions.make_log(traceback.format_exc())

if __name__ == "__main__":
    main()
