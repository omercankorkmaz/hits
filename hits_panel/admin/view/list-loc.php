<?php require admin_view('static/header') ?>
<?php if($_SESSION['user_type'] != 'admin'){header('Location:' . site_url());}?>
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
              <div class="table">
                      <table>
                          <thead>
                          <tr>
                            <th><h4>Konum Adı</h4></th>
                            <th><h4>Alıcı ID</h4></th>
                            <th><h4>İşlemler</h4></th>
                          </tr>
                          </thead>
                          <tbody>
                          <?php foreach ($query as $row): ?>
                              <tr>
                                  <td><a class="title"><?= $row['location_name'] ?></a></td>
                                  <td class="hide"><?= $row['location_receiver_name']?></td>
                                <td>
                                     <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#rec<?=$row['location_id']?>">Alıcı Değiştir</button>
                                      <form action="" method="post">
                                          <div class="modal fade" id="rec<?=$row['location_id']?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog" role="document">
                                              <div class="modal-content">
                                                <div class="modal-header">
                                                  <h5 class="modal-title" id="exampleModalLabel">Yeni alıcı IDsi girin</h5>
                                                  </button>
                                                </div>
                                                <div class="modal-body">
                                                  <label for="password">Yeni Alıcı IDsi</label>
                                                  <input type="text" class="form-control" name="rec" id="rec">
                                                </div>
                                                <div class="modal-footer">
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">İptal</button>
                                                  <input type="hidden" name="val" value="<?= $row['location_id']?>">
                                                  <input type="hidden" name="submit" value="change">
                                                  <button type="submit" class="btn btn-primary">Değiştir</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                  </form>
                                  <form action="" method="post">
                                        <input type="hidden" name="val" value="<?= $row['location_id']?>">
                                        <input type="hidden" name="delete" value="del">
                                        <button type="delete" onclick="return confirm('<?= $row['location_name']?> konumu silinsin mi?')" class="btn">Sil</a>
                                  </form>
                                  </td>
                              </tr>
                          <?php endforeach; ?>
                          </tbody>
                      </table>
                  </div>
            </div>

  <?php require admin_view('static/footer') ?>
