<?php
require '..\..\app\init.php';
if(isset($_POST['cd'])){
  $query = Users::ListUser('admin');
  $emails=[];
  foreach ($query as $row){
    $emails[$row['admin_id']] = $row['admin_email'];
  }
  $userid = $_POST['cd'];
  $to = $emails[$userid];
  $res = Users::SendResetCode($to);
  if($res){
    print(1);
  }
  else{
    print(0);
  }
}

?>
