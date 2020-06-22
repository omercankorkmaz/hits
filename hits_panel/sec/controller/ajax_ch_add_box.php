<?php
require '..\..\app\init.php';

if(isset($_POST['add'])){
    $select_html = '<select class="slt" id="bodycrtadd' . $_POST['add'] . '" name="empid' . $_POST['add'] . '"></select><br/>';
    echo $select_html;
  }
if(isset($_POST['select'])){
  $dataEmp = queries::employeeNames();
  $id = explode('-',$_POST['id']);
  $dataChat = queries::patientsCh($id[1]);
  $i = 0;
  $chats=[];
  foreach ($dataChat as $row){
    $chats[$row['employee_id']] = 1;
    $i++;
  }
  echo '<option value="">-- Çalışanlar --</option>';
  foreach ($dataEmp as $row){
    if($chats[$row['employee_id']] != 1){
    echo '<option value="' . $row['employee_id'] . '"> ' . $row['employee_firstname'] . ' ' . $row['employee_lastname'] . ' </option>';
    }
  }
}

 ?>
