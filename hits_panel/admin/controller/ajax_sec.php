<?php
require '..\..\app\init.php';
$default_del = " '%s %s sekreteri silinsin mi?' ";
$default_html = '<tr><td><a class="title"> %s %s </a><p style="font-size:12px">%s</p></td>
                                <td class="hide"> %s </td>
                              <td>
                                   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#%s">Şifre Sıfırla</button>
                                        <div class="modal fade" id="%s" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                          <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                              <div class="modal-header">
                                              <h5 class="modal-title" id="exampleModalLabel">%s %s sekreterinin şifresini sıfırlamak için sekreterin mailine bir şifre gönderilecek</h5>
                                                </button>
                                              </div>
                                              <div class="modal-body">
                                                <button class="codebtn" id="codebtn%u">Kodu Gönder</button><br/>
                                                <input type="hidden" name="codesend" value="code">
                                              </div>
                                              <div class="modal-footer">
                                              <form action="" style="display: flex;flex-direction: row; align-content: space-between; " method="post">
                                              <input type="text" class="form-control" name="code" style="margin-right:242px; width: 105px" placeholder="Kodu Girin">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">İptal</button>&nbsp&nbsp
                                                <input type="hidden" name="val" value="%u">
                                                <input type="hidden" name="submit" value="change">
                                                <button type="submit" class="btn btn-primary">Onayla</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                </form>
                                <form action="" method="post">
                                      <input type="hidden" name="val" value="%u">
                                      <input type="hidden" name="delete" value="del">
                                      <button type="delete" onclick="return confirm(%s)" class="btn">Sil</a>
                                </form>
                                </td>
    </tr>';
    $nm = '';
    $lm = 0;
    $querySec = Users::ListUser('sec');

    if(isset($_POST['cd'])){
      $querySec = Users::ListUser('sec');
      $emails=[];
      foreach ($querySec as $row){
        $emails[$row['sec_id']] = $row['sec_email'];
      }
      $userid = $_POST['cd'];
      $to =$emails[$userid];
      $res = Users::SendResetCode($to);
      if($res){
        print(1);
      }
      else{
        print(0);
      }
    }
    if(isset($_POST['limit'])){
      $lm= $_POST['limit'];}
    if(isset($_POST['name'])){
      $nm = $_POST['name'];}
    if($nm == ''){
      $nm = -1;
      }
    $limit = 0;
    foreach ($querySec as $row){
      if($limit< 10 + $lm){
        if(strpos(mb_strtolower($row['sec_firstname']).' '.mb_strtolower($row['sec_lastname']), mb_strtolower($nm,'utf8')) !== false || $nm ==(-1)){
            $del = sprintf($default_del,$row['sec_firstname'] ,$row['sec_lastname']);
            $html = sprintf($default_html, $row['sec_firstname'], $row['sec_lastname'], Encryption::decrypt($row['sec_email']), $row['reg_date'],
                                          $row['sec_id'], $row['sec_id'], $row['sec_firstname'] ,$row['sec_lastname'], $row['sec_id'],
                                           $row['sec_id'], $row['sec_id'] , $del);
            echo $html;
            }
        }
        $limit = $limit + 1;
      }

 ?>
