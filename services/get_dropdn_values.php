<?php
session_start();
include 'connection.php';
$output = array();



$sql1="select l1_id,id,pe_name from public.fpl1 where status='complete';";
$sql2="select l2_id,gid,pe_name from public.sfp_l2 where status='complete';";
$sql3="select l3_id,gid,pe_name from public.mfp_l3 where status='complete';";



//echo $sql1."<br/>";
$query1=pg_query($sql1);
$query2=pg_query($sql2);
$query3=pg_query($sql3);




if($query1)
{
    $output['fp'] = pg_fetch_all($query1);
}
if($query2)
{
    $output['sfp'] = pg_fetch_all($query2);
}
if($query3)
{
    $output['mfp'] = pg_fetch_all($query3);
}

echo  json_encode($output);

?>