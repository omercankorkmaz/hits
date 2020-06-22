<?php

if(!route(1)){
  $route[1]='/index';
}

if(!file_exists(root_admin_controller(route(1)))){
  $route[1]='/index';
}

$menus = [
  'list-admin' =>[
    'title'  => 'Yöneticiler',
    'icon' => 'user',
    'submenu' => [
      'add-admin' => 'Yönetici Ekle'
    ]
  ]
];

require root_admin_controller(route(1));
 ?>
