<?php

$meta = [
  'title' => 'HITS | Kanalları Listele'
];

$cl = xmpps::set();
xmpps::connect($cl);


$dataEmp = queries::employeeID();
if (isset($_POST['submit']) && $_POST['submit']=='change'){           //Kanala çalışan ekleme
  $id_pat = $_POST['val'];
  $id_emp = $_POST['empid'];
  foreach ($dataEmp as $row){
    if($row['employee_id'] == $id_emp){
      $res = queries::addEmpToCh($id_pat, $id_emp);
      break;
    }
  }
                                                        //Ek kutudan gelen çalışanlar
  for ($i = 0; $i>(-1); $i++) {
      if(isset($_POST['empid' . $i])){
        foreach ($dataEmp as $row){
          if($row['employee_id'] == $_POST['empid' . $i]){
            $res = queries::addEmpToCh($id_pat, $id_emp);
            break;
          }
        }
      }
      else {break;}
  }
}                                                               //Kanala çalışan ekleme bitiş
elseif (isset($_POST['delete']) && $_POST['delete'] == 'del'){  //Kanaldan çalışan silme
  $id_pat = $_POST['valPat'];
  $id_emp = $_POST['valEmp'];
  $dataPat = queries::patientNames($id_pat);
  $dataEmp = queries::employeeNames($id_emp);
  $res = xmpps::kick($cl, $dataPat['patient_firstname'], $dataPat['patient_lastname'],
                         $dataPat['patient_id'], $dataEmp['employee_firstname'], $dataEmp['employee_lastname'], $dataEmp['employee_id']);

  if($res != -1){   //XMPP işlemi  başarısız değilse devam et
    $res = queries::removeFromCh($id_pat,$id_emp);
    $row = queries::checkChEmpty($id_pat);
    if($row['patient_id']!=$id_pat){
      $res = queries::removeTagFromPatient($id_pat);
    }

    $row = queries::checkMod($id_emp,$id_pat);
    if($row){
      $res = queries::removeModFromCh($id_emp,$id_pat);
    }
  }
  else{
    $error = 'İşlem başarısız, bu kullanıcı silinemez!';
    return;
  }
}                                                                    //Kanaldan çalışan silme bitiş
elseif (isset($_POST['change']) && $_POST['change'] == 'chng'){      //Hastanın bilekliğini değiştirme
  $patient_id = $_POST['valPat'];
  $tag_id = $_POST['tag'];
  $res = queries::changeTag($tag_id, $patient_id);
}                                                                  //Hastanın bilekliğini değiştirme bitiş

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
  }
  else if(!$res){
    $error = 'İşlem başarısız';
  }
}

require sec_view('list-channels');

 ?>
