 let total_amount;
 
   async function show_item_master() {
     const result = document.getElementsByClassName('item_name');
     let item_master = await eel.get_item_master()();
     //item_master = await eel.get_item_master()();
      let tbl = document.getElementById('item_master_list')
      let tblBody = document.getElementById("item_master_list_tbody");
    // creating all cells
      for (var i = 0; i < item_master.length; i++) {
      // creates a table row
        var row = document.createElement("tr");

        for (var j = 0; j < item_master[0].length; j++) {
          var cell = document.createElement("td");
          cell.className = 'text-center'
          
          var cellText = document.createTextNode(item_master[i][j]);
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

eel.expose(clickOrder)
async function clickOrder() {
    code = document.getElementById('code').value;
    quantity = Number(document.getElementById('quantity').value);
    let item_master = await eel.get_item_master()();
    flag = 0;
    for(let i = 0; i < item_master.length; i++) {
      if(item_master[i][0] == code) {
         eel.add_order(code, quantity);
          flag = 1
          break;
      } 

    }
    if(flag == 0) {
      alert('入力された商品コードの商品は登録されていません。');
    } else {
      let [total_amount,order_list_detail] = await eel.show_order_detail_on_html()();

    
      let tbl2 = document.getElementById('order_list_detail');
      let tblBody2 = document.getElementById('order_list_detail_tbody');

      let lastRow = order_list_detail[order_list_detail.length -1];
      row = document.createElement("tr");
      for(i = 0; i < lastRow.length; i++) {
        cell = document.createElement("td");
        if((typeof lastRow[i] === 'number') && (isFinite(lastRow[i]))){
          cell.className = 'text-right'
          cellText = document.createTextNode(lastRow[i].toLocaleString());
        } else {
          cell.className = 'text-center'
          cellText = document.createTextNode(lastRow[i]);
        }

        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      tblBody2.appendChild(row);
      //tbl2.appendChild(tbl2Body);

      document.getElementById('show_total_amount').innerHTML = total_amount.toLocaleString();

    }
    document.getElementById('code').value = '';
    document.getElementById('quantity').value = '';
  }

function clickCancel() {
  eel.cancel_order();
  let tableElm = document.getElementById('order_list_detail');
  let rowLen = tableElm.rows.length;

  for (let i = rowLen-1;i > 0;i--){
    tableElm.deleteRow(i);
  }
  document.getElementById('show_total_amount').innerHTML ='';
}

eel.expose(clickCheckout)
function clickCheckout() {
  let deposit = document.getElementById('deposit').value;
  eel.order_checkout(deposit);
}

eel.expose(alertJs)
function alertJs(text){
  alert(text);
}