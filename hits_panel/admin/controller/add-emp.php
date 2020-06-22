<?php

$meta= [
  'title' => 'HITS | Çalışan Ekle'
];
$queryDep = queries::selectAll('departments');
$queryRole = queries::selectAll('roles');

if (post('submit')){
  $username=post('username');
  $firstname=post('firstname');
  $lastname=post('lastname');
  $department=post('department');
  $role = post('role');
  $personel = post('personel');
  $email = post('email');
  $perm_wifi = 0;
  $perm_show_patient = 1;
  if($role != 1){
    $perm_show_patient = 0;
  }
  $status = 1;
  if(!$username || !$email){
    $error = 'Kullanıcı adı veya email boş bırakılamaz!';
  }
  elseif(!$department){
    $error = 'Departman boş bırakılamaz!';
  }
  elseif(!$role){
    $error = 'Meslek boş bırakılamaz!';
  }
  elseif(!$personel){
    $error = 'Personel numarası boş bırakılamaz!';
  }
  elseif(!$firstname || !$lastname){
    $error = 'Ad veya soyadı boş bırakılamaz!';
  }
  else{
    $res = Users::AddEmp($username,$firstname,$lastname,$department,Encryption::encrypt($email),$role,$status,$personel,$perm_wifi,$perm_show_patient);
  }

}

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
  }
  if(!$res){
    $error = 'İşlem başarısız';
  }
}
require admin_view('add-emp');

 ?>
