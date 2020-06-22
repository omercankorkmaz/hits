<?php
require '..\..\app\init.php';
$dataEmp = queries::employeeNames();
if(isset($_POST['select'])){
    echo '<option value="">-- Çalışanlar --</option>';
    foreach ($dataEmp as $row){
      echo '<option value="' . $row['employee_id'] . '"> ' . $row['employee_firstname'] . ' ' . $row['employee_lastname'] . ' </option>';
    }

  }
else if(isset($_POST['add'])){
  $select_html = '<select class="slt" id="bodycrtadd' . $_POST['add'] . '" name="empid' . $_POST['add'] . '"></select><br/>';
  echo $select_html;
}

 ?>
