<?php

$meta= [
  'title' => 'HITS | Konum Ekle'
];

if (post('submit')){
  $locname = post('locname');
  $recname = post('recname');
  if(!$locname || !$recname){
    $error = ' Konum ve alıcı adları boş bırakılamaz!';
  }
  else{
    $res = queries::addLocations($locname,$recname)
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

require admin_view('add-loc');

 ?>
