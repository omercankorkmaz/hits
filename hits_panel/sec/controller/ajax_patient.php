<?php
require '..\..\app\init.php';

$tags = queries::unoccupiedTag();
$emptyTag='';
foreach ($tags as $row){
  if($row['tag_id'] != 11){
      $emptyTag = $emptyTag.sprintf('<option value="%u"> %s </option>',$row['tag_id'], $row['tag_number']);
  }
}

$default_html = '<tr>
      <td><a class="title">%s %s</a></td>
      <td>
           <button type="button" class="crt-%u" data-toggle="modal" data-target="#%u">Hasta Kanalı Oluştur</button>
            <form action="" method="post">
                <div class="modal fade" id="%u" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">%s %s hastası için sorumlu çalışan(lar) seçin</h5>
                        </button>
                      </div>
                      <div class="modal-body">
                      <select class="emp" id="bodycrt-%u" name="empid">
                      </select>
                        <div class="modal-body-top">
                        <a href="#" id="add%u">Ekle</a>
                        </div>
                        <div class="modal-body-bottom">
                        </div>
                        <br/>
                        <select id="tag" name="tag">
                        <option value="">--Bileklik  Numaraları--</option>
                        <option value="11">-</option>
                        '.$emptyTag.'
                        </select>
                      </div>
                      <div class="modal-footer">
                        <button type="button" id="cancel" class="cancel" data-dismiss="modal">İptal</button>
                        <input type="hidden" name="val" value="%u">
                        <input type="hidden" name="submit" value="change">
                        <button type="submit" class="btn btn-primary">Oluştur</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
        </td>
  </tr>';

$query = queries::patients();

$dataEmp = queries::employeeNames();
$nm ='';
$lm = 0;

if(isset($_POST['name'])){
  $nm = $_POST['name'];}
if(isset($_POST['limit'])){
  $lm= $_POST['limit'];}
$limit = 0;
if(isset($_POST['data'])){
  $default_crt = '<option value="%u"> %s %s </option>';
  $id = explode('-',$_POST['data']);
  echo '<option value="">-- Çalışanlar --</option>';
  foreach ($dataEmp as $row){
    $crt = sprintf($default_crt, $row['employee_id'], $row['employee_firstname'], $row['employee_lastname'] );
    echo $crt;
  }
}
else {
  if($nm != ''){
      foreach ($query as $row){
      if($limit< 10 + $lm){
        if(strpos(mb_strtolower($row['patient_firstname']).' '.mb_strtolower($row['patient_lastname']), mb_strtolower($nm,'utf8')) !== false){
              $html = sprintf($default_html, $row['patient_firstname'], $row['patient_lastname'], $row['patient_id'], $row['patient_id'], $row['patient_id'],
                              $row['patient_firstname'], $row['patient_lastname'], $row['patient_id'], $row['patient_id'], $row['patient_id']);
                echo $html;
          }
      }
      $limit = $limit + 1;
    }
  }
  else{
  foreach ($query as $row){
    if($limit< 10 + $lm){
    $html = sprintf($default_html, $row['patient_firstname'], $row['patient_lastname'], $row['patient_id'], $row['patient_id'], $row['patient_id'],
                    $row['patient_firstname'], $row['patient_lastname'], $row['patient_id'], $row['patient_id'], $row['patient_id']);
        echo $html;
      }
      $limit = $limit + 1;
    }
  }
}


 ?>
