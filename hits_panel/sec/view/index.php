<?php require sec_view('static/header') ?>
<?php if($_SESSION['user_type'] != 'sec' || $_SESSION['user_id']==1){header('Location:' . site_url());}?>
<?php if($_SESSION['time'] < time()){header('Location:' . site_url()); session_destroy();} else{$_SESSION['time'] = time() + 900;}?>
  <script>
    $(function(){
      var h = $(window).height();
      $('.sidebar').css('height',h+'px');
      $('.box-container').css('height',h+'px');
    });
  </script>
    <div class="box-container">
        <div class="box" id="div-0">
            <h3>Sekreter Anasayfa</h3>
            <div class="box-content">
                <p>
                </p>
            </div>
        </div>
    </div>


<?php require sec_view('static/footer') ?>
