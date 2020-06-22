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
        <div class="box" id="div-0">
            <h3>Sunucu Durumları</h3>
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
            <div class="box-content">
              <table style="width:90%; font-size:100%">
                <thead>
                  <tr>
                    <th><h4> Sunucu Adı </h4></th>
                    <th><h4> Sunucu Adresleri </h4></th>
                    <th><h4> İşlemler </h4></th>
                  </tr>
                </thead>
                <tbody>
              <?php foreach ($states as $key => $row): ?>
                <tr>
                <?php if($row == 1): ?>
                  <td><strong><?= $key?><b style="color:green; font-size:20px" > çalışıyor!</b></td>
                    <td><strong>IP: </strong><?= $ips[$key]?> &nbsp;<strong>DNS: </strong> <?=  $ips[$key.'dns']?> </td>
                    <td>
                      <form action="" method="post">
                      <input type="hidden" name="val" value="<?= $key?>">
                      <input type="hidden" name="submit" value="stop">
                      <button type="submit" class="btn">Durdur</button></td></form>
                  </strong>
                <?php else:?>
                  <td><strong><?= $key?><b style="color:red; font-size:20px" > çalışmıyor!</b></td>
                      <td>-</td>
                    <td>
                      <form action="" method="post">
                      <input type="hidden" name="val" value="<?= $key?>">
                      <input type="hidden" name="submit" value="start">
                      <button type="submit" class="btn">Başlat</button></td></form>
                  </strong>
                <?php endif; ?>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
            </div>
        </div>
    </div>


<?php require admin_view('static/footer') ?>
