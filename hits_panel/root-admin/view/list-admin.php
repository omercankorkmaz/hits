<?php require root_admin_view('static/header') ?>
<?php if($_SESSION['user_id'] != 1){header('Location:' . site_url());}?>
<?php if($_SESSION['time'] < time()){header('Location:' . site_url()); session_destroy();} else{$_SESSION['time'] = time() + 900;}?>
<script type="text/javascript">
$(function(){
$(window).on('click', function(e){
  var string = String(e.target.outerHTML);
  var id = parseInt(string.match(/[0-9]+/g));
  var res;
  $(`#codebtn${id}`).on('click', function(e){
    console.log(id);
    $.post('controller/ajax_admin.php',{'cd': id},function(response){
      response = String(response);
      if(response.charAt(0) == 1 ){
        alert('Mail gönderildi! Kod birazdan mailinize ulaşacaktır');
      }
      else{
        alert('Mail gönderilemedi! Lütfen tekrar deneyin');
      }

  });
});
});
});
</script>
    <div class="box-container">
        <div class="box" id="div-0">
            <h3> Adminler </h3>
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
                          <th <h4>İsim Soyadı</h4></th>
                          <th class="hide"><h4>Kayıt Tarihi</h4></th>
                          <th><h4>İşlemler</h4></th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($query as $row): ?>
                            <tr>
                                <td class="hide"><a class="title"><?= $row['admin_firstname'],' ' ,$row['admin_lastname'] ?></a><p style="font-size:12px"><?=Encryption::decrypt($row['admin_email'])?></p></td>
                                <td class="hide"><?= $row['reg_date'] ?></td>
                              <td>
                                  <?php if($row['admin_id'] != 1): ?>
                                   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#<?=$row['admin_id']?>">Şifre Sıfırla</button>
                                        <div class="modal fade" id="<?=$row['admin_id']?>" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel"><?= $row['admin_firstname'] . ' ' . $row['admin_lastname'] ?> yöneticisinin şifresini sıfırlamak için mailine bir şifre gönderilecek</h5>
                                                  </button>
                                                </div>
                                                <div class="modal-body">
                                                  <button class="codebtn" id="codebtn<?=$row['admin_id']?>">Kodu Gönder</button><br/>
                                                  <input type="hidden" name="codesend" value="code">
                                                </div>
                                                <div class="modal-footer">
                                                <form action="" style="display: flex;flex-direction: row; align-content: space-between; " method="post">
                                                <input type="text" class="form-control" name="code" style="margin-right:242px; width: 105px" placeholder="Kodu Girin">
                                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">İptal</button>&nbsp&nbsp
                                                  <input type="hidden" name="submit" value="change">
                                                  <button type="submit" class="btn btn-primary">Onayla</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                </form>
                                <form action="" method="post">
                                      <input type="hidden" name="val" value="<?= $row['admin_id']?>">
                                      <input type="hidden" name="delete" value="del">
                                      <button type="delete" onclick="return confirm('<?= $row['admin_username']?> kullanıcısı silinsin mi?')" class="btn">Sil</a>
                                </form>
                                  <?php else:?>
                                    <button type="button"  class="btn" data-toggle="modal" data-target="#Modal">Şifre Değiştir</button>
                                    <form action="" method="post">
                                         <div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
                                           <div class="modal-dialog" role="document">
                                             <div class="modal-content">
                                               <div class="modal-header">
                                                 <h5 class="modal-title" id="ModalLabel"><?= $row['admin_username']?> kullanıcısı için yeni şifre girin</h5>
                                                 </button>
                                               </div>
                                               <div class="modal-body">
                                                 <label for="password">Şifre</label>
                                                 <input type="password" class="form-control" name="password" id="password" placeholder="*******">
                                               </div>
                                               <div class="modal-footer">
                                                 <button type="button" class="btn btn-secondary" data-dismiss="modal">İptal</button>
                                                 <input type="hidden" name="val" value="<?= $row['admin_id']?>">
                                                 <input type="hidden" name="submit" value="change">
                                                 <button type="submit" class="btn btn-primary">Değiştir</button>
                                               </div>
                                              </form>
                                             </div>
                                           </div>
                                         </div>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
        </div>

    </div>


<?php require root_admin_view('static/footer') ?>
