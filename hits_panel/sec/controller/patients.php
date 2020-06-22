<?php

$meta = [
  'title' => 'HITS | Hastaları Listele'
];

$query = queries::patients();
$dataEmp = queries::employeeID();

if (isset($_POST['submit']) && $_POST['submit']=='change'){   //Kanal oluşturma
  $id_pat = $_POST['val'];
  $id_emp = $_POST['empid'];
  $tag = $_POST['tag'];

  foreach ($dataEmp as $row){
    if($row['employee_id'] == $id_emp && $tag!=''){
      $res = queries::addEmpToCh($id_pat, $row['employee_id']);
      $res = queries::addTagToPat($id_pat, $tag);
      break;
    }
  }
  for ($i = 0; $i>(-1); $i++) {
      if(isset($_POST['empid' . $i]) && $_POST['empid' . $i]!=''){
        foreach ($dataEmp as $row){
          if($row['employee_id'] == $_POST['empid' . $i]){
            $res = queries::addEmpToCh($id_pat, $row['employee_id']);
            break;
          }
        }
      }
      else {break;}
  }
}                                                            //Kanal oluşturma bitiş

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
  }
  if(!$res){
    $error = 'İşlem başarısız';
  }
}

require sec_view('patients');

 ?>
