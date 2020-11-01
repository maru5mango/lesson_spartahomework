$(document).ready(function(){
  $.ajax({
   type: "GET",
   url: "https://api.manana.kr/exchange/rate.json",
   data: {},
   success: function(response) {
     let e = response[1]['rate']
     $('#exchange').text(e)

   }
  })

  function ImageSwitcher(choices, i) {
    i = 0;
    this.Next = function() {
      hide_current_image();
      show_next_image();
    }
    
    var hide_current_image = function() {
      if(choices){
        choices[i].style.visibility = "hidden";
        i += 1;
      }
    }

    var show_next_image = function() {
      if(choices){
        if(i === (choices.length)) {
          i = 0;
        }
        choices[i].style.visibility = "visible";
      }
    }
  
  }
    
  var pants = $(".pant");
  var shirts = $(".shirt");

  var shirt_picker = new ImageSwitcher(shirts);
  document.getElementById('shirt_button').onclick = function() {
    shirt_picker.Next();
    let id;
    let img;

    let top_p={'top1':100, 'top2': 120, 'top3':90, 'top4': 20, 'top5':80, 'top6': 100, 'top7':140}
    for(let i=0; i<7; i++){
      if(shirts[i].style.visibility==="visible"){
        id=shirts[i].getAttribute('id')
        let top_price=top_p[id]
        id=id.toUpperCase()
        img=shirts[i].getAttribute('src')
        $('#top_name').text(id)
        $('#price_img_top').attr('src',img)
        $('#top_price').text('₩'+top_price)
      }
    }
  };
  
  var pants_picker = new ImageSwitcher(pants);
  document.getElementById('pant_button').onclick = function() {
    pants_picker.Next();
    let id;
    let img;

    let bottom_prices={'bottom1':110, 'bottom2':100, 'bottom3': 80, 'bottom4': 130, 'bottom5': 140, 'bottom6':200, 'bottom7':90}
    for(let i=0; i<7; i++){
      if(pants[i].style.visibility==="visible"){
        id=pants[i].getAttribute('id')
        let bottom_p=bottom_prices[id]
        id=id.toUpperCase()
        img=pants[i].getAttribute('src')
        $('#bottom_name').text(id)
        $('#price_img_bottom').attr('src',img)
        $('#bottom_price').text('₩'+bottom_p)
      }
    }

  };
  orderboxShow();

});

function order() {
  let name = $('#name').val();
  let t_order = $('#order-top').val();
  let b_order = $('#order-bottom').val();
  let t_count = $('#t_count').val();
  let b_count = $('#b_count').val();
  let email = $('#email').val();
  let addr1 = $('#sample4_roadAddress').val();
  let addr2 = $('#sample4_detailAddress').val();
  let tel = $('#tel').val();

  let re = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  let re2 = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[-][0-9]{3,4}[-][0-9]{4}$/;

  if (name === '') {
    alert('이름을 입력해주세요')
    $('#name').focus()
  }else if (t_order === '' && b_order=== ''){
    alert('상품을 선택해 주세요')
    $('#order-top').focus()
  } else if (t_count + b_count < 1) {
    alert('수량을 입력해주세요')
    $('#t_count').focus()
  } else
    if (email === '') {
    alert('이메일을 입력해주세요')
    $('#email').focus()
  } else if (!check(re, email,"적합하지 않은 이메일 형식입니다.")) {
  } else if (tel === '') {
    alert('휴대폰번호를 입력해주세요')
    $('tel').focus()
  } else if (!check(re2, tel, "휴대폰 번호는 010-000-0000형식으로 입력해주세요.")) {
  } else if( addr1 === ''){
    alert('주소를 검색해 주세요.')
  } else if( addr2 === ''){
    alert('상세주소를 입력해 주세요.')
    $('#sample4_detailAddress').focus()
  }
    else { 
          orderboxUpload(name, t_order, t_count, b_order, b_count, email, tel, addr1)
          remove()
  }
}


function remove(){
  $('#name').val('')
  $('#order-top').val('');
  $('#order-bottom').val('');
  $('#t_count').val('');
  $('#b_count').val('');
  $('#email').val('');
  $('#sample4_detailAddress').val('');
  $('#sample4_roadAddress').val('');
  $('#tel').val('');
}

function boxopen() {
  $('#orderbox').css('visibility',"visible")
}


function boxclose() {
  $('#orderbox').css('visibility',"hidden")
}

function check(re, what, message) {
     if(re.test(what)) {
         return true;
     }
     alert(message);
     what.value="";
}

function orderboxUpload(name, t_order, t_count, b_order, b_count, email, tel, addr1){
  let t_ordername='TOP'+t_order
  let b_ordername='BOTTOM'+b_order
  
  if( t_count === '') {
    t_count=0;
    t_ordername='X'
  }
  if( b_count === '') {
    b_count=0;
    b_ordername='X'
  }

   $.ajax({
          type: "POST",
          url: "/order",
          data: {name: name, t_order: t_ordername, t_count: t_count, b_order: b_ordername, b_count: b_count, email: email, tel: tel, addr1: addr1},
          success: function (response) {
              if (response["result"] === "success") {
                  alert(response["msg"]);
                  window.location.reload();
              }
          }
   })
}

function orderboxShow(){
  $.ajax({
          type: "GET",
          url: "/order",
          data: {},
          success: function (response) {
              if (response["result"] === "success") {
                  let order = response["order_list"];
                  for (let i = 0; i < order.length; i++) {
                      makeTable(order[i]["name"], order[i]["t_order"], order[i]["t_count"],order[i]["b_order"],order[i]["b_count"],order[i]["email"], order[i]["tel"], order[i]["addr1"]);
                  }
              } else {
                  alert("메모를 받아오지 못했습니다.");
              }
          }
  })


function makeTable(name, t_order, t_count, b_order, b_count, email, tel, addr1) {
  tempHtml = `<tr>
                <td>${name}</td>
                <td>${t_order}</td>
                <td>${t_count}개</td>
                <td>${b_order}</td>
                <td>${b_count}개</td>
                <td>${email}</td>
                <td>${tel}</td>
                <td>${addr1}</td>
              </tr>`
  $('#orderinfo').append(tempHtml);
  $('#orderbox').css('visibility','visible')
}}