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



async function clickCU() {

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
            console.log('全てOK');
          }
        }
      }
    }
  }
};
  
// async function check_duplicate(val) {
//   let res = await eel.check_duplicate(val)();
//   console.log(res);
//   return res
// }



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