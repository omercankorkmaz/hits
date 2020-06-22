<?php require sec_view('static/header') ?>
<?php if($_SESSION['user_type'] != 'sec'){header('Location:' . site_url());}?>
<?php if($_SESSION['time'] < time()){header('Location:' . site_url()); session_destroy();} else{$_SESSION['time'] = time() + 900;}?>
  <script>
    $(function(){
      var h = $(window).height();
      $('.sidebar').css('height',h+'px');
      $('.box-container').css('height',h+'px');
    });
  </script>
  <div class="box-container">
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
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalTab">Şifre Değiştir</button>
               <form action="" method="post">
                   <div class="modal fade" id="modalTab" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                     <div class="modal-dialog" role="document">
                       <div class="modal-content">
                         <div class="modal-header">
                           <h5 class="modal-title" id="exampleModalLabel">Yeni bir şifre girin</h5>
                           </button>
                         </div>
                         <div class="modal-body">
                           <label for="password">Şu anki şifreniz</label>
                           <input type="password" class="form-control" name="password" id="password" placeholder="*******">
                           <label for="password">Yeni şifreniz</label>
                           <input type="password" class="form-control" name="password2" id="password2" placeholder="*******">
                           <label for="password">Yeni şifreniz tekrar</label>
                           <input type="password" class="form-control" name="password3" id="password3" placeholder="*******">
                         </div>
                         <div class="modal-footer">
                           <button type="button" class="btn btn-secondary" data-dismiss="modal">İptal</button>
                           <input type="hidden" name="submit" value="change">
                           <button type="submit" class="btn btn-primary">Değiştir</button>
                         </div>
                       </div>
                     </div>
                   </div>
            </div>









  <?php require sec_view('static/footer') ?>
