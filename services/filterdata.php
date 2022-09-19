<?php
session_start();
include 'connection.php';
$output = array();
$con = new Connection();
$con->connectionDB();

$fdatarr=$_REQUEST['fdatarr'];

$a=json_decode($fdatarr);
if($a->phase_color=='' && $a->fp=='' && $a->sfp=='' && $a->mfp==''){
    echo "data array is empty";
}

$output['phase_color']= $a->phase_color;
$output['fp']= $a->fp;
$output['sfp']= $a->sfp;
$output['mfp']= $a->mfp;

$con->closeConnection();
//$con = new Connection();
//$con->closeConnection();
echo  json_encode($output);

?>