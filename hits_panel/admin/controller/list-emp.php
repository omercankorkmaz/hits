<?php

$meta = [
  'title' => 'HITS | Çalışanları Listele'
];

$queryDep = queries::selectAll('departments');
$queryRole = queries::selectAll('roles');

if(isset($_POST['val'])){
  $id = $_POST['val'];
}

if (isset($_POST['submit']) && $_POST['submit'] == 'change'){
  $code = $_POST['code'];
  $real_code = $_SESSION['real_code'];
  $to = $_SESSION['to_user'];
  $res = Users::ResetPassword($to, $id, $code, $real_code, 'employee');
}
else if (isset($_POST['submit']) && $_POST['submit'] == 'takeperm'){
  $res = queries::permission($id, $_POST['perm_val'],0);
}
else if (isset($_POST['submit']) && $_POST['submit'] == 'giveperm'){
    $res = queries::permission($id, $_POST['perm_val'],1);
}
else if (isset($_POST['delete']) && $_POST['delete'] == 'del'){
  $res = Users::DelUser($id,'employee');
}

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
  }
  if(!$res){
    $error = 'İşlem başarısız';
  }
}

require admin_view('list-emp');
 ?>
