let total_amount;
let item_master = [];

const update_btn = document.getElementById('update_btn');
update_btn.disabled = true

// 商品リストの表示
async function show_item_master() {
  let item_master = await eel.get_item_master()();

  let tbl = document.getElementById('item_master_list')
  let tblBody = document.getElementById("item_master_list_tbody");
    for (var i = 0; i < item_master.length; i++) {
      row = make_table_row(item_master[i]);
      tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);

   }

show_item_master();

//テーブルの行タグを生成する関数
function make_table_row(list) {
  let tr = document.createElement("tr");
  let col_counts = list.length;
  for (let i = 0; i < col_counts; i++){
    let td = document.createElement("td");
    IntCol = 2;
    if(i == IntCol) {
      list[i] = Number(list[i]);
      td.className = 'text-right';
      tdText = document.createTextNode(list[i].toLocaleString());
    } else {
       td.className = 'text-center';
      tdText = document.createTextNode(list[i]);
    }
    td.appendChild(tdText);
    tr.appendChild(td);
  }
  return tr;
}

async function clickCreate() {
  let item_code = document.getElementById('code').value;
  let item_name = document.getElementById('name').value;
  let item_price= document.getElementById('price').value;

  let res =  await eel.check_duplicate(item_code)();

  // console.log('結果' + res);
  if(check_blanc('商品コード', item_code) ){
    if(res) {
      text = '商品コードが重複しています。';
      alert(text);
    } else {
      if(check_blanc('商品名', item_name)) {
        if(check_blanc('価格', item_price)) {
          item_price = Number(item_price);
          if(check_int('価格', item_price)) {
            text = '商品コード'+item_code+'\n'+'超品名'+item_name+'\n'+'価格'+item_price+'円\n上記の内容で登録しますか？';
            ans = window.confirm(text);
            if(ans){
              await eel.register_new_item(item_code, item_name, item_price)();
              //商品マスタをリロード
              clear_data_on_table();
              show_item_master();
              document.getElementById('code').value = ''
              document.getElementById('name').value = ''
              document.getElementById('price').value = ''
            }
          }
        }
      }
    }
  }
};
  
async function clickFind() {
  update_btn.disabled = false
  let item_code = document.getElementById('code').value;
  let item_name = document.getElementById('name').value;
  let item_price= document.getElementById('price').value;

   if(check_blanc('商品コード', item_code) ) {
    let item = await eel.find_item_in_item_master(item_code)();
    item_name = item[1];
    item_price = item[2];
    document.getElementById('name').value = item_name;
    document.getElementById('price').value = item_price;
   } 
  
}

async function clickUpdate(){
  let item_code = document.getElementById('code').value;
  let item_name = document.getElementById('name').value;
  let item_price= document.getElementById('price').value;
  text = '商品コード'+item_code+'\n'+'超品名'+item_name+'\n'+'価格'+item_price+'円\n上記の通りに変更しますか？';
  ans = window.confirm(text);
  if(ans){
    await eel.update_item_master(item_code, item_name, item_price);
    //商品マスタをリロード
    clear_data_on_table();
    show_item_master();
    document.getElementById('code').value = ''
    document.getElementById('name').value = ''
    document.getElementById('price').value = ''
    update_btn.disabled = true;

  }
}

async function clickDelete() {
  let item_code = document.getElementById('code_del').value;
  if(check_blanc('商品コード', item_code) ) {
    let result = await eel.find_itemcode_in_item_master(item_code)();
    if(result) {
       let ans = window.confirm("「商品コード:" + item_code + "」の商品を" + "削除しますか?");
       if(ans) {
          await eel.delete_item_in_master(item_code)()
         //商品マスタをリロード
          clear_data_on_table();
          show_item_master();
          document.getElementById('code_del').value = ''
       }
    } else {
      text = 'この商品コードの商品は商品マスターに登録されてません。'
      alertJs(text);
    }
  }
}

// 商品マスタの画面クリア
function clear_data_on_table(){
  let tableElm = document.getElementById('item_master_list');
  let rowLen = tableElm.rows.length;
  for (let i = rowLen-1;i > 0;i--){
    tableElm.deleteRow(i);
  }
}

//アプリ終了
function clickQuit(){
  eel.quit_program();

 }

// バリデーション
function check_blanc(place, val) {
  if (val == '') {
    text = place + 'が未入力です。';
    alertJs(text);
  } else {
    return true;
  }
}

function check_int(place, val){
  if (!Number.isInteger(val)) {
    text = place + 'には整数を入力して下さい。';
    alertJs(text);
  } else {
    return true;
  }

}

// アラート
eel.expose(alertJs)
function alertJs(text){
  alert(text);
}