<?php
$hostname = '172.20.82.73';
//$hostname = 'localhost';
$port = 5432;
//$port = 5433;
$database = 'db_corona_dss';
$username = 'postgres';
//$password = 'uu123';
$password = 'diamondx';
$connectStr =     "host=" . $hostname ." port=" . $port . " dbname=" .   $database . " user=" . $username . " password=" . $password;
$dbcon = pg_connect($connectStr);
if(!$dbcon){
    echo "Connection failed";
}
$store_procedure_connection="pgsql:host=".$hostname.";port=".$port.";dbname=".$database."";
?>