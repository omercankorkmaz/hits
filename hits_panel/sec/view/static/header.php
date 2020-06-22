<!doctype html>
<html lang="en">
<head>

  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><?= $meta['title'] ?></title>

    <!--styles-->
    <link rel="stylesheet" href="<?= sec_public_url('styles/finalv2.css') ?>">
<link rel="stylesheet" href="//use.fontawesome.com/releases/v5.13.0/css/all.css">
    <!--scripts-->
    <script src="<?= sec_public_url('scripts/jquery-1.12.2.min.js') ?>"></script>
    <!--    <script src="https://cdn.ckeditor.com/4.5.7/basic/ckeditor.js"></script>-->
    <script src="<?= sec_public_url('scripts/admin.js') ?>"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
            integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
            crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
            integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
            crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
            crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.js"></script>
</head>
<body>

<!--navbar-->
<div class="navbar">
    <ul dropdown>
            <a style="color:white;"href="#">
                <i class="fas fa-hospital-symbol"></i>
                <span class="title">
            HASTANE İLETİŞİM VE TAKİP SİSTEMİ
        </span>
            </a>
    </ul>
    <?php if(session('user_id')): ?>
      <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <?=session('user_name')?>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="<?= site_url('quit') ?>">Çıkış Yap</a>
                        </div>
                    </div>
    <?php endif; ?>
</div>

<!--sidebar-->
<div style="padding-left: 4px;"class="sidebar">

    <ul>
        <?php foreach ($menus as $mainUrl => $menu): ?>
            <li class="<?=(route(1) == $mainUrl) || isset($menu['submenu'][route(1)]) ? 'active' : null?>">
                <a href="<?=sec_url($mainUrl)?>">
                    <i class="fas fa-<?= $menu['icon'] ?>"></i>
                    <span class="title">
                        <?= $menu['title'] ?>
                    </span>
                </a>
                <?php if (isset($menu['submenu'])): ?>
                    <ul class="sub-menu">
                        <?php foreach ($menu['submenu'] as $url => $title): ?>
                        <li>
                            <a href="<?=sec_url($url)?>">
                                <?=$title?>
                            </a>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </li>
        <?php endforeach; ?>
        <li class="line">
            <span></span>
        </li>
    </ul>


</div>

<!--content-->
<div class="content">
