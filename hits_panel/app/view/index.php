<?php
?>
<?php require view('static/header') ?>
    <div class="container">
      <div class="row justify-content-md-center mt-4">
          <div class="col-md-4">
              <form action="" method="post">
                  <h3 class="mb-3">Giriş Yap</h3>
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
                      <label for="username">Kullanıcı Adı</label>
                      <input type="text" value="<?=post('username')?>" class="form-control" name="username" id="username"placeholder="Bir kullanıcı adı yazın..">
                  </div>
                  <div class="form-group">
                      <label for="password">Şifre</label>
                      <input type="password" class="form-control" name="password" id="password" placeholder="*******">
                  </div>
                  <div class="form-group">
                      <label><input type="radio" name="type" value="sec">Sekreter </label>&nbsp;&nbsp;
                      <label><input type="radio"  name="type" value="admin">Admin </label> <br>
                  </div>
                  <input type="hidden" name="submit" value="1">
                  <button type="submit" class="btn btn-primary">Giriş Yap</button>
              </form>
          </div>
      </div>
</div>
<?php require view('static/footer') ?>
