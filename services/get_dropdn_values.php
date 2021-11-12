<?php
session_start();
include 'connection.php';
$output = array();

Class Dropdowns
{

public function fillDropdown(){
    $lyr = $_REQUEST['lyr'];
    $di = $_REQUEST['di'];


        if ($lyr == 'fp') {
            $sql = "select l1_id,id,pe_name from public.fpl1 where status='Completed';";
        } else if ($lyr == 'sfp') {
            $sql = "select l2_id,gid,pe_name from public.sfp_l2 where l1_id='$di';";
        } else if ($lyr == 'mfp') {
            $sql = "select l3_id,gid,pe_name from public.mfp_l3 where l2_id='$di';";
        }
//status='Completed' and
//$sql3="select l3_id,gid,pe_name from public.mfp_l3 where status='Completed';";


//echo $sql1."<br/>";
    $query1 = pg_query($sql);
//$query2=pg_query($sql2);
//$query3=pg_query($sql3);


    if ($query1) {
        if ($lyr == 'fp') {
            return $output['fp'] = pg_fetch_all($query1);
        }else if($lyr == 'sfp'){
            return $output['sfp'] = pg_fetch_all($query1);
        }else if($lyr == 'mfp'){
            return $output['mfp'] = pg_fetch_all($query1);
        }
    }
//if($query2)
//{
//    $output['sfp'] = pg_fetch_all($query2);
//}
//if($query3)
//{
//    $output['mfp'] = pg_fetch_all($query3);
//}
}
}
$rs=new Dropdowns();
echo  json_encode($rs->fillDropdown());

?>