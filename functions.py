import datetime 
from config import *

### ログ出力関数
def make_log(txt):
    now = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    logStr = '[%s:%s] %s' % ('log', now, txt)
    #ファイルに出力
    with open(LOG_FILE_PATH, 'a', encoding='utf-8_sig') as f:
        f.write(logStr + '\n')
   
    
def get_current_datetime() :    
  return datetime.datetime.now().strftime('%Y-%m-%d_%H_%M_%S')

def get_current_date():
  return datetime.datetime.now().strftime('%Y-%m-%d')