from config import *
import csv

## 商品クラス
class Item:
    def __init__(self, item_code, item_name, price):
        self.item_code = item_code
        self.item_name = item_name
        self.price = price

    def get_code(self):
        return self.item_code

    def get_price(self):
        return self.price

    def get_name(self):
        return self.item_name

    def view_item(self):
        print('--------------------')
        print(f'商品コード:{self.item_code}')
        print(f'商品名:{self.item_name}')
        print(f'価格:{self.price}円')
        print('--------------------')
        print(' ')

    def add_to_master(self, item_master_file_path=ITEMS_MASTER_PATH):
        row = [self.item_code, self.item_name, self.price]

        list = ItemsMaster(item_master_file_path).get_master()
        list.append(row)

        with open(ITEMS_MASTER_PATH, 'w', encoding='utf-8_sig', newline='') as file:
            writer = csv.writer(file, lineterminator='\n')
            writer.writerows(list)

## 商品マスタクラス
class ItemsMaster:
    def __init__(self, item_master_file_path) -> None:
        self.item_master = []
        self.item_master_file_path = item_master_file_path
        self.item_code_list = []

    def get_master(self):
        with open(self.item_master_file_path, 'r', encoding='utf-8_sig', newline='') as file:
            reader = csv.reader(file)
            for row in reader:
                self.item_master.append(row)
        return self.item_master

    def get_item_code_list(self):
        self.item_master = self.get_master()
        items_count = len(self.item_master)
        for i in range(0, items_count):
            code = self.item_master[i][0]
            self.item_code_list.append(code)
        return self.item_code_list
        
### オーダークラス
class Order:
    def __init__(self, item_master_file_path):
        self.item_order_list = []
        self.item_order_list_detail = []
        self.item_master_file_path = item_master_file_path
    # ４
    #オーダー登録時に個数も登録できるようにしてください
    def add_item_order(self, item_code, quantity):
        one_order = [item_code, quantity]
        self.item_order_list.append(one_order)
        return self.item_order_list
    #注文一覧を表示するメソッド
    def view_item_list(self):
        print('### 注文表 ###')
        print('商品コード', '数量')
        for item in self.item_order_list:
            print(item[0], item[1])

    #注文の明細を表示するメソッド
    def view_order_detail(self):
        detail_list, total = self.make_order_detail()
        print('')
        print('### 取引明細 ###')
        print('商品コード', '商品名', '数量', '単価', '金額')
        for row in detail_list:
            print(row[0], row[1], row[2], row[3], row[4])
        print(f'合計金額 {total:,}円')

    #オーダー明細、合計金額をリスト化するメソッド
    def make_order_detail(self):
        item_master = ItemsMaster(self.item_master_file_path).get_master()
        self.item_order_list_detail = []
        self.total_amount = 0
        for order in self.item_order_list:
            for item in item_master:
                if order[0] in item:
                    code = item[0]
                    name = item[1]
                    price = int(item[2])
                    quantity = int(order[1])
                    amount = price * quantity
                    self.item_order_list_detail.append(
                        [code, name, price, quantity, amount])
                    self.total_amount += amount
        return self.item_order_list_detail, self.total_amount

    def cancel_order_all(self):
        self.item_order_list = []
        self.item_order_list_detail = []
