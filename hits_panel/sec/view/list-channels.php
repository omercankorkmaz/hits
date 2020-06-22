<?php require sec_view('static/header') ?>
<?php if($_SESSION['user_type'] != 'sec'){header('Location:' . site_url());}?>
<?php if($_SESSION['time'] < time()){header('Location:' . site_url()); session_destroy();} else{$_SESSION['time'] = time() + 900;}?>
  <style>
  .loader {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 150px;
    height: 150px;
    margin: -75px 0 0 -75px;
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }

  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>

  <script type="text/javascript">
  var limit = 0;
    $(window).scroll(function() {
      var scrollHeight = $(document).height();
    	var scrollPosition = $(window).height() + $(window).scrollTop();
    	 if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
         limit = limit + 10;
         $.post('controller/ajax_ch.php',{'limit':limit},function(response){
           $('.sidebar').css('height',scrollHeight+'px');
           $('.box-container').css('height',scrollHeight+'px');
           $('#table').html(response);
       });
       }
    });
  $(function(){
    var h = $(window).height();
    $('.sidebar').css('height',h+'px');
    $('.box-container').css('height',h+'px');
    $.post('controller/ajax_ch.php',function(response){
      $('.loader').hide();
      $('#table').html(response);
  });

  $('#name').on('change', function(e){
      var data = $('#name').val();
      $.post('controller/ajax_ch.php',{'name':data, 'limit':limit},function(response){
        $('#table').html(response);
    });
  });

  $('#reset').on('click', function(e){
    $('#name').val('');
    $.post('controller/ajax_ch.php',{'name':'', 'limit':limit},function(response){
      $('#table').html(response);
  });
  });
});
  </script>

  <div class="box-container">
      <div class="box" id="div-0">
          <h3> Konuşma Kanalları </h3>
          <?php if ($err = error()):?>
              <div class="alert alert-danger" id="danger" role="alert">
                  <?=$err?>
                  <script>
                  setTimeout(function(){ $('#danger').hide(); }, 3000);
                  </script>
              </div>
          <?php endif; ?>
          <?php if ($success = success()): ?>
              <div class="alert alert-success" id="succ" role="alert">
                  <?=$success?>
                  <script>
                  setTimeout(function(){ $('#succ').hide(); }, 3000);
                  </script>
              </div> <?php endif; ?>
          <div class="table">
            <table>
              <thead>
              <tr>
                  <th><input style="height:40px;" type="name" class="form-control" name="name" id="name" placeholder="İsme Göre"></th>
                  <th> <button id="reset" class="reset">Filtreleri Sıfırla</button></th>
              </tr>
            </thead> </table>
                  <table>
                      <thead>
                      <tr>
                          <th><h4>Hastanın Adı Soyadı</h4></th>
                          <th><h4>Bileklik Numarası</h4></th>
                          <th><h4>İşlemler</h4></th>
                      </tr>
                      </thead>
                      <tbody id="table">

                      </tbody>
                      <div class="loader" id="loader"></div>
                  </table>
              </div>
      </div>
  </div>
<script>
$(function(){

  var c=0;
  $('#table').on("click",function(e){
    if((e.target.localName) == 'a'){
      $.post('controller/ajax_ch_add_box.php', {'add' : c} , function(response){
        $('.modal-body-bottom').append(response);
      }).done(function(){
        $.post('controller/ajax_ch_add_box.php', {'select' : c, 'id' : e.target.id} , function(response){
            $(`.slt`).html(response);
        }).done(function(){
          c = c +1;
        });
      });
    }
    else if((e.target.id).includes('cancel') || (e.target.className) == 'modal fade'){ //iptalde kutuların silinmesi
      $('.modal-body-bottom').empty();
      c= 0;
      $('.tag').val('');
      $('.emp').val('');
    }
  if(e.target.className.includes('dlt')){
    $.post('controller/ajax_ch.php', {'data':e.target.className} ,function(response){   //kanaldaki çalışanları görüntüleme
      $(`#body${e.target.className}`).html(response);
  });
  }
  if(e.target.className.includes('crt')){
    $.post('controller/ajax_ch.php', {'crt':e.target.className} ,function(response){    //ilk kutunun içeriği
      $(`#body${e.target.className}`).html(response);
  });
  }
  });
});
</script>



<?php require sec_view('static/footer') ?>
