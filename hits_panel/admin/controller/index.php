<?php
require __DIR__ . '/../../app\classes\Aws\functions.php';
require __DIR__ . '/../../app\classes\GuzzleHttp\Promise\functions.php';
require __DIR__ . '/../../app\classes\GuzzleHttp\Psr7\functions.php';
require __DIR__ . '/../../app\classes\GuzzleHttp\functions.php';

$meta = [
  'title' => 'HITS'
];

$ec2Client = new Aws\Ec2\Ec2Client([
    'region' => 'me-south-1',
    'version' => 'latest',
    'credentials' => [
        'key' => 'XX',
        'secret' => 'XX',
      ],
    'http'    => [
          'verify' => __DIR__ . '/../../app\certificates\cacert.pem'
      ]
]);

$instances = [
  'MySQL (Standart Veritabanı)' => 'XX',
  'XMPP (Mesajlaşma Sunucusu)' => 'XX',
  'CassandraDB (Mesaj Veritabanı)' => 'XX'
];
$states = [];
$ips = [];

foreach ($instances as $key => $value) {
  $result = $ec2Client->describeInstanceStatus([
    'InstanceIds' => [$value],
  ]);
  if(isset($result->get('InstanceStatuses')[0])){
    if($result->get('InstanceStatuses')[0]['InstanceState']['Code'] == 16){
      $states[$key] = 1;
      $resultOfIp = $ec2Client->describeInstances([
        'InstanceIds' => [$value],
      ]);
      $ips[$key] = $resultOfIp->get('Reservations')[0]['Instances'][0]['PublicIpAddress'];
      $ips[$key.'dns'] =  $resultOfIp->get('Reservations')[0]['Instances'][0]['PublicDnsName'];
    }
  }
  else{
    $states[$key] = 0;
  }
}

if(isset($_POST['submit']) && $_POST['submit'] == 'stop'){
  $instanceName = $_POST['val'];
  $resultStop = $ec2Client->stopInstances([
    'InstanceIds' => [$instances[$instanceName]],
  ]);
  if($resultStop->get('StoppingInstances')[0]['CurrentState']['Code'] == 64){
    $success = 'İşlem başarılı! Birkaç saniye bekleyin..';
    header("Refresh:3");
  }
  else {
    $error = 'İşlem başarısız';
  }
}
else if(isset($_POST['submit']) && $_POST['submit'] == 'start'){
  $instanceName = $_POST['val'];
  $resultStart = $ec2Client->startInstances([
    'InstanceIds' => [$instances[$instanceName]],
]);
  if($resultStart->get('StartingInstances')[0]['CurrentState']['Code'] == 0){
    $success = 'İşlem başarılı! Birkaç saniye bekleyin..';
    header("Refresh:3");
  }
  else{
    $error = 'İşlem başarısız';
  }
}
require admin_view('index');

 ?>
