<?php

if(!route(1)){
  $route[1]='/index';
}

if(!file_exists(sec_controller(route(1)))){
  $route[1]='/index';
}

$menus = [
  'patients' =>[
    'title' => 'Hastaları Listele',
    'icon' => 'user-injured'
  ],
  'list-channels' =>[
    'title' => 'Kanalları Listele',
    'icon' => 'comment-medical'
  ],
  'settings' =>[
    'title' => 'Ayarlar',
    'icon' => 'cog'
  ]
];

require sec_controller(route(1));
 ?>
