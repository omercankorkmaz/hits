<?php require root_admin_view('static/header') ?>
<?php if($_SESSION['user_id'] != 1){header('Location:' . site_url());}?>
<?php if($_SESSION['time'] < time()){header('Location:' . site_url()); session_destroy();} else{$_SESSION['time'] = time() + 900;}?>
    <div class="box-container">
            <h3>Root Admin Sayfası</h3>
        </div>


<?php require root_admin_view('static/footer') ?>
