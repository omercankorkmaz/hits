<?php
function sec_controller($controllerName){
    $controllerName = strtolower($controllerName);
    return PATH . '/sec/controller/' . $controllerName . '.php';
}

function sec_view($viewName){
  return  PATH . '/sec/view/' . $viewName . '.php';
}

function sec_url($url = false){
  return URL . '/sec/' . $url;
}

function sec_public_url($url = false){
  return URL . '/sec/public/' . $url;
}
 ?>
