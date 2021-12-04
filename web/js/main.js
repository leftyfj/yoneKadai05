let total_amount;
let item_master = [];

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

    item_table=document.getElementById('item_master_list');
    cells = item_table.getElementsByTagName('td')
    for(let i = 0; i < cells.length; i++) {
      if(i % 3 == 2) {
        console.log(cells[i]);
        cells[i].className = 'text-right';
      }
    }
   }

show_item_master();

//注文追加
async function clickOrder() {
  code = document.getElementById('code').value;
  check_blanc('商品コード', code);
  quantity = Number(document.getElementById('quantity').value);
  check_blanc('数量', quantity);
  check_int('数量', quantity);
  let item_master = await eel.get_item_master()();
  let flag = check_item_in_master(code, item_master);
  if(flag){
    eel.add_order(code, quantity);
    // 注文詳細を更新
    let [total_amount,order_list_detail] = await eel.show_order_detail_on_html()();
  
    make_order_detail_table('order_list_detail_tbody',total_amount, order_list_detail);
  }else {
    text = '入力された商品コードの商品は登録されていません。';
    alertJs(text);
  }
}

// 注文キャンセル
function clickCancel(){
  eel.cancel_order();
  let tableElm = document.getElementById('order_list_detail');
  let rowLen = tableElm.rows.length;
  for (let i = rowLen-1;i > 0;i--){
    tableElm.deleteRow(i);
  }
  document.getElementById('show_total_amount').innerHTML ='';
}

// 会計
async function clickCheckout() {
  let deposit = Number(document.getElementById('deposit').value);
  check_blanc('お預かり金額', deposit);
  check_int('お預かり金額', deposit);
  let result = await eel.order_checkout(deposit)();
  if (result) {
    eel.init_order();
    clear_data_on_table();
  }
}

// 注文明細の表示
function make_order_detail_table(tablebodyid, amount, list) {
  let tableBody = document.getElementById(tablebodyid);
  let oneRow = list[list.length-1];
  row = make_table_row(oneRow);
  tableBody.appendChild(row);
  document.getElementById('show_total_amount').innerHTML = amount.toLocaleString();
  document.getElementById('code').value = '';
  document.getElementById('quantity').value = '';
}

// 注文明細の画面クリア
function clear_data_on_table(){
  let tableElm = document.getElementById('order_list_detail');
  let rowLen = tableElm.rows.length;
  for (let i = rowLen-1;i > 0;i--){
    tableElm.deleteRow(i);
  }
  document.getElementById('show_total_amount').innerHTML ='';
  document.getElementById('deposit').value = ''
}
// バリデーション
function check_blanc(place, val) {
  if (val == '') {
    text = place + 'が未入力です。';
    alertJs(text);
  }
}

function check_int(place, val){
  if(!Number.isInteger(val)) {
    text = place + 'には整数を入力して下さい。';
    alertJs(text);
  }
}

function check_item_in_master(val, master) {
  let flag = false;
  for(let i = 0; i < master.length; i++) {
    if(master[i][0] == val) {
      flag = true;
      break;
    }
  }
  return flag;
}

//テーブルの行タグを生成する関数
function make_table_row(list) {
  let tr = document.createElement("tr");
  let col_counts = list.length;
  for (let i = 0; i < col_counts; i++){
    let td = document.createElement("td");
    if((typeof list[i] === 'number') && (isFinite(list[i]))){
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

// アラート
eel.expose(alertJs)
function alertJs(text){
  alert(text);
}



