<?php
function admin_controller($controllerName){
    $controllerName = strtolower($controllerName);
    return PATH . '/admin/controller/' . $controllerName . '.php';
}

function admin_view($viewName){
  return  PATH . '/admin/view/' . $viewName . '.php';
}

function admin_url($url = false){
  return URL . '/admin/' . $url;
}

function admin_public_url($url = false){
  return URL . '/admin/public/' . $url;
}
 ?>
