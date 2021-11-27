import functions
import datetime

ITEMS_MASTER_PATH = 'items_master.csv'
ORDER_BALANCE_PATH = 'order_balance.csv'

_datetime = datetime.datetime.now().strftime('%Y-%m-%d_%H_%M_%S')
_datetime2 = datetime.datetime.now().strftime('%Y-%m-%d')
TRANSACTION_FILE_PATH = f'./transaction/trans_{_datetime}.txt'
LOG_FILE_PATH = f'./log/log_{_datetime2}.txt'
