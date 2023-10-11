<?php
session_start();
include 'connection.php';
$output = array();

Class Dropdowns extends connection
{
function __construct()
    {
        $this->connectionDB();

    }
public function fillDropdown(){
    $lyr = $_REQUEST['lyr'];
    $di = $_REQUEST['di'];


        if ($lyr == 'fp') {
            $sql = "select l1_id,id,pe_name,st_x((st_dump(geom)).geom) as x,st_y((st_dump(geom)).geom) as y from public.fpl1 order by l1_id";
            $sql2="select count(*),phase from public.demand_point where phase is not null and phase<>''  and dp_type<>'High-Rise' group by phase";
            $sql3="select count(*),phase from dp_high_rise where phase is not null and phase<>'' and gid in (select gid from demand_point where dp_type='High-Rise') group by phase";
        } else if ($lyr == 'sfp') {
            $sql = "select l2_id,gid,pe_name,st_x((st_dump(geom)).geom) as x,st_y((st_dump(geom)).geom) as y from public.sfp_l2 where l1_id='$di';";
            $sql2="select count(*),phase from public.demand_point where phase is not null and l1_id='$di' and dp_type<>'High-Rise' group by phase";
            $sql3="select count(*),phase from dp_high_rise where  phase is not null and l1_id='$di' and gid in (select gid from demand_point where dp_type='High-Rise') group by phase";

            

        } else if ($lyr == 'mfp') {
            $sql = "select l3_id,gid,pe_name,st_x((st_dump(geom)).geom) as x,st_y((st_dump(geom)).geom) as y from public.mfp_l3 where l2_id='$di';";
            $sql2="select count(*),phase from public.demand_point where phase is not null and l2_id='$di' and dp_type<>'High-Rise' group by phase";
            $sql3="select count(*),phase from dp_high_rise where  phase is not null and l2_id='$di' and gid in (select gid from demand_point where dp_type='High-Rise') group by phase";

        }else{
            $sql2="select count(*),phase from public.demand_point where phase is not null and l3_id='$di' and dp_type<>'High-Rise' group by phase";
            $sql3="select count(*),phase from dp_high_rise where  phase is not null and l3_id='$di' and gid in (select gid from demand_point where dp_type='High-Rise') group by phase";

        }
//        $sql1="select count(*) from public.demand_point where phase='R' and (l1_id ilike '$lid' or l2_id ilike '$lid' or l3_id ilike '$lid');";
//        $sql2="select count(*) from public.demand_point where phase='Y' and (l1_id ilike '$lid' or l2_id ilike '$lid' or l3_id ilike '$lid');";
//        $sql3="select count(*) from public.demand_point where phase='B' and (l1_id ilike '$lid' or l2_id ilike '$lid' or l3_id ilike '$lid');";   
//        $sql4="select count(*) from public.demand_point where phase='RYB' and (l1_id ilike '$lid' or l2_id ilike '$lid' or l3_id ilike '$lid');";  
//status='Completed' and
//$sql3="select l3_id,gid,pe_name from public.mfp_l3 where status='Completed';";


//echo $sql1."<br/>";
    $query1 = pg_query($sql);
   // echo sql2;
    $query2 = pg_query($sql2);

    $query3 = pg_query($sql3);
//$query2=pg_query($sql2);
//$query3=pg_query($sql3);


    if ($query1) {
        if ($lyr == 'fp') {
        $output['fp'] = pg_fetch_all($query1);
        }else if($lyr == 'sfp'){
        $output['sfp'] = pg_fetch_all($query1);
        } else if($lyr == 'mfp'){
            $output['mfp'] = pg_fetch_all($query1);
        }
    }
    if($query2){
        if ($lyr == 'fp') {
        $output['count']=pg_fetch_all($query2);
        }else if($lyr == 'sfp'){
            $output['count']=pg_fetch_all($query2);
        } else if($lyr == 'mfp'){
            $output['count']=pg_fetch_all($query2);
        }
    }

    if($query3){
        if ($lyr == 'fp') {
        $output['count_h']=pg_fetch_all($query3);
        }else if($lyr == 'sfp'){
            $output['count_h']=pg_fetch_all($query3);
        } else if($lyr == 'mfp'){
            $output['count_h']=pg_fetch_all($query3);
        }
    }


        
         
         $this->closeConnection();  
       
        return $output;
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