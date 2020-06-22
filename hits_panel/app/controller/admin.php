<?php

if(!route(1)){
  $route[1]='/index';
}

if(!file_exists(admin_controller(route(1)))){
  $route[1]='/index';
}

$menus = [
  'index' => [
    'title' => 'Anasayfa',
    'icon' => 'server'
  ],
  'list-emp' =>[
    'title'  => 'Çalışanlar',
    'icon' => 'hospital-user',
    'submenu' => [
      'add-emp' => 'Çalışan Ekle',
    ]
  ],
  'list-sec' =>[
    'title'  => 'Sekreterler',
    'icon' => 'user',
    'submenu' => [
      'add-sec' => 'Sekreter Ekle',
    ]
  ],
  'add-tag' => [
    'title' => 'Bileklik Ekle',
    'icon' => 'tags'
  ],
  'list-loc' => [
    'title' => 'Konumlar',
    'icon' => 'street-view',
    'submenu' => [
      'add-loc' => 'Konum Ekle',
    ]
  ],
  'settings' =>[
    'title' => 'Ayarlar',
    'icon' => 'cog'
  ]
];

require admin_controller(route(1));
 ?>
