let total_amount;
let item_master = [];

// 商品リストの表示
async function show_item_master() {
  let item_master = await eel.get_item_master()();
  let tbl = document.getElementById('item_master_list')
  let tblBody = document.getElementById("item_master_list_tbody");
    for (var i = 0; i < item_master.length; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < item_master[0].length; j++) {
        let cell = document.createElement("td");
        cell.className = 'text-center'
        let cellText = document.createTextNode(item_master[i][j]);
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
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
  let lastRow = list[list.length-1];
  let row = document.createElement("tr");
  let cellText;
  for (let i=0;i<lastRow.length;i++){
    let cell = document.createElement("td");
    if((typeof lastRow[i] === 'number') && (isFinite(lastRow[i]))){
      cell.className = 'text-right';
      cellText = document.createTextNode(lastRow[i].toLocaleString());
    } else {
      cell.className = 'text-center'
      cellText = document.createTextNode(lastRow[i]);
    }
    cell.appendChild(cellText);
    row.appendChild(cell);
  }
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

// アラート
eel.expose(alertJs)
function alertJs(text){
  alert(text);
}



