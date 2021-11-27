#開始
import eel

import traceback
import os

from possystem import Item
from possystem import Order
from possystem import ItemsMaster
from config import *
from functions import *

eel.init("web")
eel.start("index.html")

os.makedirs(os.path.dirname(TRANSACTION_FILE_PATH), exist_ok=True)
os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)
### ログ出力関数
def make_log(txt):
    now = get_current_datetime()
    logStr = '[%s:%s] %s' % ('log', now, txt)
    #ファイルに出力
    with open(LOG_FILE_PATH, 'a', encoding='utf-8_sig') as f:
        f.write(logStr + '\n')
        
### メイン処理
def main():
    try:
        # ３
        #商品マスタをCSVから登録できるようにしてください
        #商品マスタの呼び出し
        
        # マスタ登録
        #新商品のマスタ登録
        make_log('開始')
        print('### 新商品マスタ登録 ###')
        confirm = input('商品登録をしますか？ はい⇒ Y(y)、 いいえ => N (n)')
        item_master = ItemsMaster().get_master()
        confirm = confirm.upper()
        if confirm == 'Y':
            make_log('商品登録開始')
            check = 'Y'
            while True: 
                code = str(input('商品コードを入力して下さい。'))
                ##商品コード重複確認
                flag = 0
                for item in item_master:
                    if code in item:
                        flag = 0
                        break
                    else:
                        flag = 1
                
                if flag == 0:
                    make_log('商品コード重複')
                    print('この商品コードは既に使用されています。変更してください。')
                    continue
                else:
                    break
                    
            name = input('商品名を入力して下さい。')
            price = int(input('価格を入力して下さい。'))
            new_item = Item(code, name, price)
            new_item.add_to_master()
                
            check = input('登録を続けますか？ 続ける ⇒ Y、 終わる => N ')
            check = check.upper()
        make_log('商品登録終了')
        print('注文に移ります')

        # ２
        # オーダーをコンソール（ターミナル）から登録できるようにしてください
        # 登録時は商品コードをキーとする
        
        # ６
        # お客様からのお預かり金額を入力しお釣りを計算できるようにしてください
        # オーダー登録
        make_log('オーダー開始')
        order = Order(item_master)
        check = 'Y'
        while check == 'Y':
            code = input('商品コードを入力して下さい。')
            quantity = input('数量を入力して下さい。')
            order.add_item_order(code, quantity)
            
            check = input('続けますか？ 続ける ⇒ Y、 終わる => N ')
            check = check.upper()
        else:
            deposit = int(input('お預かりした金額を入力して下さい。'))
            print('注文を終了します。')   
            make_log('オーダー終了')
        # オーダー表示
        # １
        #オーダー登録した商品の一覧（商品名、価格）を表示できるようにしてください
        make_log('オーダー内容画面表示')
        order.view_item_list()
        # ５
        # オーダー登録した商品の一覧（商品名、価格）を表示し、かつ合計金額、個数を表示できるようにしてください
        make_log('オーダー内容詳細画面表示')
        order.view_order_detail()
        
        detail, total_amount = order.make_order_detail()
        change = deposit - total_amount
        print(f'お預かり {deposit:,}円')
        print(f'お釣り:{change:,}円')
        
        # ７
        # 課題５、６の内容を、日付時刻をファイル名としたレシートファイル（テキスト）に出力できるようにしてください
        with open(TRANSACTION_FILE_PATH, 'a', encoding='utf-8_sig', newline='\n') as file:
            print('商品コード,', '商品名,', '数量,', '単価,', '金額', file=file)
            for row in detail:
                file.write(",".join(str(_) for _ in row) + '\n')
            print(f'合計:{total_amount:,}円', file=file)
            print(f'入金:{deposit:,}円', file=file)
            print(f'釣り:{change:,}円' + '\n', file=file)
        
        make_log('オーダー内容詳細をテキストファイルに保存')
        make_log('終了')
    except:
        print('操作に誤りがありました。終了します。')
        make_log('例外発生')
        make_log(traceback.format_exc())
        
if __name__ == "__main__":
    main()