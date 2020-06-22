<?php

$meta = [
  'title' => 'HITS | Konumları Listele'
];

$query = queries::selectAll('locations');

if (isset($_POST['submit']) && $_POST['submit']=='change'){
  $locid = $_POST['val'];
  $rec = $_POST['rec'];
  $res = queries::changeReceiver($rec,$locid);
}
elseif (isset($_POST['delete']) && $_POST['delete'] == 'del'){
  $locid = $_POST['val'];
  $res = queries::deleteLocation($locid);
}

if(isset($res)){
  if($res){
    $success = 'İşlem başarılı!';
    header("Refresh:0");
  }
  if(!$res){
    $error = 'İşlem başarısız';
  }
}


require admin_view('list-loc');

 ?>
