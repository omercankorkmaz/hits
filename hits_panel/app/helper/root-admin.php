<?php
function root_admin_controller($controllerName){
    $controllerName = strtolower($controllerName);
    return PATH . '/root-admin/controller/' . $controllerName . '.php';
}

function root_admin_view($viewName){
  return  PATH . '/root-admin/view/' . $viewName . '.php';
}

function root_admin_url($url = false){
  return URL . '/root-admin/' . $url;
}

function root_admin_public_url($url = false){
  return URL . '/root-admin/public/' . $url;
}
 ?>
