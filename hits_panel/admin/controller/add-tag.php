<?php

$meta= [
  'title' => 'HITS | Çalışan Ekle'
];

if (post('submit')){
  $tag_no = post('tag_no');
  if(!$tag_no){
    $error = 'Bileklik numarası boş bırakılamaz!';
  }
  else{
      $res = queries::addTag($tag_no);
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

require admin_view('add-tag');

 ?>
