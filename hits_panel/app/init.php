<?php
session_start();
ob_start();
function loadClasses($className){
  require __DIR__ .'/classes/' . strtolower($className) . '.php';

}
spl_autoload_register('loadClasses');

$config = require __DIR__ . '/config.php';
try{
  $db = new PDO('mysql:host=' . $config['db']['host'] . ';dbname=' . $config['db']['name'] ,$config['db']['user'] ,$config['db']['pass'],array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
}catch(PDOException $e){
  die($e->getMessage());
}

foreach(glob(__DIR__ . '/helper/*.php') as $helperFile){
  require $helperFile;
}
?>
