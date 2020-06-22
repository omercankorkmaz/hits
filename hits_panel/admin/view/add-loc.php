<?php require admin_view('static/header') ?>
<?php if($_SESSION['user_type'] != 'admin' || $_SESSION['user_id']==1){header('Location:' . site_url());}?>
<?php if($_SESSION['time'] < time()){header('Location:' . site_url()); session_destroy();} else{$_SESSION['time'] = time() + 900;}?>
<script>
$(function(){
  var h = $(window).height();
  $('.sidebar').css('height',h+'px');
  $('.box-container').css('height',h+'px');
});
</script>
    <div class="box-container">
      <div class="row justify-content-md-center mt-4">
          <div class="col-md-4">
              <form action="" method="post">
                  <h3 class="mb-3">Konum Ekle</h3>
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
                  <div class="form-group">
                      <input type="text" class="form-control" name="locname" id="locname" placeholder="Konum Adı"><br/>
                      <input type="text" class="form-control" name="recname" id="recname" placeholder="Alıcı Adı"><br/>
                  </div>
                  <input type="hidden" name="submit" value="1">
                  <button type="submit" class="btn btn-primary">Ekle</button>
              </form>
          </div>
      </div>
</div>
<?php require admin_view('static/footer') ?>
