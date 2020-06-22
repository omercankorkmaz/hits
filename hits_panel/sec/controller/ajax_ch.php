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
  <td><a >%s</a></td>
  <td>
       <button type="button" class="crt-%u" data-toggle="modal" data-target="#%u">Çalışan Ekle</button>
        <form action="" method="post">
            <div class="modal fade" id="%u" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">%s %s hastası için sorumlu çalışan ekleyin</h5>
                    </button>
                  </div>
                  <div id="body" class="modal-body">
                    <select class="emp" id="bodycrt-%u" name="empid">
                    </select>
                    <div class="modal-body-top">
                    <a href="#" id="add-%u">Ekle</a>
                    </div>
                  <div class="modal-body-bottom">
                  </div>
                </div>
                  <div class="modal-footer">
                    <button type="button" class="cancel" id="cancel" data-dismiss="modal">İptal</button>
                    <input type="hidden" name="val" value="%u">
                    <input type="hidden" name="submit" value="change">
                    <button type="submit" class="btn btn-primary">Ekle</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
    </td>
    <td>
         <button type="button" class="dlt-%u" data-toggle="modal" data-target="#%u-">Kanaldaki Çalışanları Görüntüle</button>
          <form action="" method="post">
              <div class="modal fade" id="%u-" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">%s %s hastası için sorumlu çalışanlar</h5>
                      </button>
                    </div>
                    <div id="bodydlt-%u" class="modal-body">
                  </div>
                  </div>
                </div>
              </div>
            </form>
      </td>
      <td>
           <button type="button" class="chn-%u" data-toggle="modal" data-target="#%uC">Bileklik Değiştir</button>
            <form action="" method="post">
                <div class="modal fade" id="%uC" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">%s %s hastası için bileklik kaydını değiştirin</h5>
                        </button>
                      </div>
                      <div id="body" class="modal-body">
                      <select name="tag" class="tag" id="tag">
                      <option value="">--Bileklik Numaraları--</option>
                      <option value="11">-</option>
                      '. $emptyTag .'
                      </select>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="cancel" id="cancel" data-dismiss="modal">İptal</button>

                        <input type="hidden" name="valPat" value="%u">
                        <input type="hidden" name="change" value="chng">
                        <button type="change" class="btn btn-primary">Değiştir</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
        </td>
</tr>';

$query = queries::chList();

$dataEmp = queries::employeeNames();
$emps=[];
foreach ($dataEmp as $row){
  $emps[$row['employee_id']] = $row['employee_firstname'] . ' ' . $row['employee_lastname'];
}
$nm = '';
$lm  = 0;
if(isset($_POST['limit'])){
  $lm= $_POST['limit'];}
if(isset($_POST['name'])){
  $nm = $_POST['name'];}
$limit = 0;

if(isset($_POST['crt'])){                                     //Kanala çalışan ekleme
    $default_crt = '<option value="%u"> %s </option>';
    $id = explode('-',$_POST['crt']);
    $queryChat = queries::patientsCh($id[1]);
    $i = 0;
    $chats=[];
    foreach ($queryChat as $row){
      $chats[$row['employee_id']] = 1;
      $i++;
    }
    $dataEmpID = queries::employeeID();
    echo '<option value="">-- Çalışanlar  --</option>';
    foreach ($dataEmpID as $row){
      if($chats[$row['employee_id']] != 1){
          $crt = sprintf($default_crt, $row['employee_id'], $emps[$row['employee_id']]);
          echo $crt;
      }
  }
}                                                       //Kanala çalışan ekleme bitiş

else if(isset($_POST['data'])){                         //Çalışanları görüntüleme ve kanaldan çalışan silme
  $default_del = '<table>
    <td>%s
      <input type="hidden" name="valEmp" value="%u">
      <input type="hidden" name="valPat" value="%u">
      <input type="hidden" name="delete" value="del">
    </td>
    <td >
      <button style="float: right;" type="delete" class="delete" >Sil</button>
    </td>
  </table>';

  $chat = queries::selectAll('employee_patient');
  preg_match_all('!\d+!', $_POST['data'], $matches);
  $id  = implode(' ', $matches[0]);
  foreach ($chat as $row){
      if($id == $row['patient_id']){
      $del = sprintf($default_del, $emps[$row['employee_id']], $row['employee_id'], $row['patient_id']);
      echo $del;
    }


  }
}                                                     //Çalışanları görüntüleme ve kanaldan çalışan silme
else{
  if($nm != ''){
    foreach ($query as $row){
      if($limit< 10 + $lm){
        if(strpos(mb_strtolower($row['patient_firstname']).' '.mb_strtolower($row['patient_lastname']), mb_strtolower($nm,'utf8')) !== false){
          $html = sprintf($default_html, $row['patient_firstname'],$row['patient_lastname'], $row['tag_number'],$row['patient_id'],$row['patient_id'], $row['patient_id'], $row['patient_firstname'],
                $row['patient_lastname'], $row['patient_id'], $row['patient_id'], $row['patient_id'] ,$row['patient_id'], $row['patient_id'], $row['patient_id'], $row['patient_firstname'],
                $row['patient_lastname'], $row['patient_id'],$row['patient_id'],$row['patient_id'],$row['patient_id'],$row['patient_firstname'],$row['patient_lastname'],$row['patient_id']);
            echo $html;
          }
        }
        $limit = $limit + 1;
    }
  }
  else{
  foreach ($query as $row){
    if($limit< 10 + $lm){
    $html = sprintf($default_html, $row['patient_firstname'],$row['patient_lastname'], $row['tag_number'],$row['patient_id'],$row['patient_id'], $row['patient_id'], $row['patient_firstname'],
          $row['patient_lastname'], $row['patient_id'], $row['patient_id'], $row['patient_id'] ,$row['patient_id'], $row['patient_id'], $row['patient_id'], $row['patient_firstname'],
          $row['patient_lastname'], $row['patient_id'],$row['patient_id'],$row['patient_id'],$row['patient_id'],$row['patient_firstname'],$row['patient_lastname'],$row['patient_id']);
      echo $html;
      }
        $limit = $limit + 1;
    }
    }
}


 ?>
