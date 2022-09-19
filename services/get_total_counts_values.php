<?php
session_start();
include 'connection.php';
$output = array();
$con = new Connection();
$con->connectionDB();
$lid=$_GET['lid'];
$level=$_GET['level'];

if($lid=='%'){
    $sql1="select count(*) from public.demand_point where phase='R';";
    $sql2="select count(*) from public.demand_point where phase='Y';";
    $sql3="select count(*) from public.demand_point where phase='B';";   
    $sql4="select count(*) from public.demand_point where phase='RYB';";
} else if($level=='fp'){
    $sql1="select count(*) from public.demand_point where phase='R' and l1_id ilike '$lid';";
    $sql2="select count(*) from public.demand_point where phase='Y' and l1_id ilike '$lid' ;";
    $sql3="select count(*) from public.demand_point where phase='B' and l1_id ilike '$lid' ;";   
    $sql4="select count(*) from public.demand_point where phase='RYB' and l1_id ilike '$lid' ;";  
}
else if($level=='sfp'){
    $sql1="select count(*) from public.demand_point where phase='R' and l2_id ilike '$lid';";
    $sql2="select count(*) from public.demand_point where phase='Y' and l2_id ilike '$lid' ;";
    $sql3="select count(*) from public.demand_point where phase='B' and l2_id ilike '$lid' ;";   
    $sql4="select count(*) from public.demand_point where phase='RYB' and l2_id ilike '$lid' ;";  
}
else if($level=='mfp'){
    $sql1="select count(*) from public.demand_point where phase='R' and l3_id ilike '$lid';";
    $sql2="select count(*) from public.demand_point where phase='Y' and l3_id ilike '$lid' ;";
    $sql3="select count(*) from public.demand_point where phase='B' and l3_id ilike '$lid' ;";   
    $sql4="select count(*) from public.demand_point where phase='RYB' and l3_id ilike '$lid' ;";  
}

//echo $sql1."<br/>";
$query1=pg_query($sql1);
$query2=pg_query($sql2);
$query3=pg_query($sql3);
$query4=pg_query($sql4);


if($query1)
{
    $output['Rsingle'] = pg_fetch_all($query1);
}
if($query2)
{
    $output['Ysingle'] = pg_fetch_all($query2);
}
if($query3)
{
    $output['Bsingle'] = pg_fetch_all($query3);
}
if($query4)
{
    $output['RYBthree'] = pg_fetch_all($query4);
}
$con->closeConnection();

echo  json_encode($output);

?>