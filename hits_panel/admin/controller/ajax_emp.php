<?php
require '..\..\app\init.php';
$default_del = " '%s %s çalışanı silinsin mi?' ";
$default_perm = "<table>
                  <tr><td>Hastalar Sayfasını Görüntüleme</td><td><input type='hidden' name='perm_val' value='show_patients'>%s</td></tr>
                  <tr><td>Hastane Ağı Dışında Bağlanma</td><td><input type='hidden' name='perm_val' value='wifi_outside'>%s</td></tr>
                </table>";
$button = [];
$button[0] = "<input type='hidden' name='submit' value='giveperm'>
              <button style='float:right;' type='submit' class='btn btn-primary'>İzin Ver</button>";
$button[1] = "<input type='hidden' name='submit' value='takeperm'>
              <button style='float:right;' type='submit' class='btn btn-primary'>İzin Verme</button>";
$default_html = '<tr><td><a class="title"> %s %s </a><p style="font-size:12px">%s</p></td>
<td class="hide"> %s </td>
<td class="hide"> %s </td>
<td>
   <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#%u">Şifre Sıfırla</button>
        <div class="modal fade" id="%u" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div id="gel" class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">%s %s çalışanının şifresini sıfırlamak için çalışanın mailine bir şifre gönderilecek</h5>
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
      <button type="delete" onclick="return confirm(%s)" class="btn">Sil</button>
</form>
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#%uperm">İzinler</button>
 <form action="" method="post">
     <div class="modal fade" id="%uperm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
       <div class="modal-dialog" role="document">
         <div class="modal-content">
           <div id="gel" class="modal-header">
             <h5 class="modal-title" id="exampleModalLabel">%s %s çalışanı için izinler</h5>
             </button>
           </div>
           <div class="modal-body">
           <input type="hidden" name="val" value="%u">
           %s
           </div>
         </div>
       </div>
     </div>
</form>
</td></tr>';

$data = queries::empList();

$queryDep = queries::selectAll('departments');
$deps=[];
foreach ($queryDep as $row){
  $deps[$row['department_id']] = $row['department_name'];
}

$queryRole = queries::selectAll('roles');
$roles=[];
foreach ($queryRole as $row){
  $roles[$row['role_id']] = $row['role_name'];
}

$emails=[];
foreach ($data as $row){
  $emails[$row['employee_id']] = $row['employee_email'];
}

if(isset($_POST['cd'])){
  $empid = $_POST['cd'];
  $to = $emails[$empid];
  $res = Users::SendResetCode($to);
  if($res){
    print(1);
  }
  else{
    print(0);
  }
}
$nm = '';
$dp = '';
$rl = '';
$lm = 0;
if(isset($_POST['name'])){
  $nm = $_POST['name'];}
if(isset($_POST['department'])){
  $dp = $_POST['department'];}
if(isset($_POST['role'])){
  $rl= $_POST['role'];}
if(isset($_POST['limit'])){
    $lm= $_POST['limit'];}


if($nm == ''){
  $nm = -1;
}
if($dp == ''){
  $dp = -1;
}
if($rl == ''){
  $rl = -1;
}

$limit = 0;
foreach ($data as $row){
  if($limit< 10 + $lm){
    if(strpos(mb_strtolower($row['employee_firstname']).' '.mb_strtolower($row['employee_lastname']), mb_strtolower($nm,'utf8')) !== false || $nm ==(-1)){
      if(strcmp(strtolower($row['department_id']), strtolower($dp))==0 || $dp ==(-1)){
        if(strcmp(strtolower($row['role_id']), strtolower($rl))==0 || $rl ==(-1)){
            $perm = sprintf($default_perm, $button[$row['show_patients']], $button[$row['wifi_outside']]);
            $del = sprintf($default_del,$row['employee_firstname'], $row['employee_lastname']);
            $html = sprintf($default_html,$row['employee_firstname'], $row['employee_lastname'], Encryption::decrypt($row['employee_email']), $deps[$row['department_id']], $roles[$row['role_id']], $row['employee_id'],
                                          $row['employee_id'], $row['employee_firstname'],$row['employee_lastname'],$row['employee_id'],$row['employee_id'], $row['employee_id'],
                                          $del, $row['employee_id'], $row['employee_id'], $row['employee_firstname'],$row['employee_lastname'], $row['permission_id'], $perm);
            echo $html; }
          }
        }
      }
  $limit = $limit + 1;
}


 ?>
