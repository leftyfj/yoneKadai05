import datetime

# def get_current_datetime():
#   return datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

# def get_current_date():
#   return datetime.datetime.now().strftime('%Y-%m-%d')

current_datetime = datetime.datetime.now().strftime('%Y-%m-%d_%H_%M_%S')
current_date = datetime.datetime.now().strftime('%Y-%m-%d')

ITEMS_MASTER_PATH = 'items_master.csv'
ORDER_BALANCE_PATH = 'order_balance.csv'
TRANSACTION_FILE_PATH = f'./transaction/trans_{current_datetime}.txt'
LOG_FILE_PATH = f'./log/log_{current_date}.txt'


