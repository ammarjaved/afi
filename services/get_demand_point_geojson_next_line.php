


<?php
include("connection.php");

class Tehsil extends connection {
    function __construct()
    {
        $this->connectionDB();

    }

    public function getquerydata() {

        $lid=$_REQUEST['lid'];
        $level=$_REQUEST['level'];
        if($level=='sfp'){
            $sql = "SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','gid',gid,'geometry',ST_AsGeoJSON(geom)::json,
                'properties', json_build_object(
                'gid', gid,
                'cd_id', cd_id,
                'pe_name',pe_name ,
                'l1_id',l1_id,
                'l2_id', l2_id,
                'l3_id', l3_id,
                'acc_no', acc_no,
                'address', address,
                'install_id',install_id,
                'meter_type', meter_type,
                'bcrm_eqp', bcrm_eqp,
                'site_eqp', site_eqp,
                'phase', phase,
                'images', images,
                'fd_no', fd_no,
                'id1', id1,
                'device_id', device_id,
                'image2', image2,
                'image3', image3,
                'image4', image4,
                'image5', image5
                ))))
                FROM (SELECT gid, cd_id, pe_name, l1_id, l2_id, l3_id, acc_no, address, install_id, meter_type, bcrm_eqp, site_eqp, phase, fd_no, images, id1, device_id, image2, image3, image4, image5, geom
               FROM public.demand_point where  l2_id ilike '$lid' and l3_id='') as tbl1;";
        }else{
            $sql = "SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','gid',gid,'geometry',ST_AsGeoJSON(geom)::json,
            'properties', json_build_object(
            'gid', gid,
            'cd_id', cd_id,
            'pe_name',pe_name ,
            'l1_id',l1_id,
            'l2_id', l2_id,
            'l3_id', l3_id,
            'acc_no', acc_no,
            'address', address,
            'install_id',install_id,
            'meter_type', meter_type,
            'bcrm_eqp', bcrm_eqp,
            'site_eqp', site_eqp,
            'phase', phase,
            'images', images,
            'fd_no', fd_no,
            'id1', id1,
            'device_id', device_id,
            'image2', image2,
            'image3', image3,
            'image4', image4,
            'image5', image5
            ))))
            FROM (SELECT gid, cd_id, pe_name, l1_id, l2_id, l3_id, acc_no, address, install_id, meter_type, bcrm_eqp, site_eqp, phase, fd_no, images, id1, device_id, image2, image3, image4, image5, geom
           FROM public.demand_point where  l3_id ilike '$lid') as tbl1;";
        }




        //    echo $sql;
        //     exit();
        $output = array();
        $result_query = pg_query($sql);
        if ($result_query) {
             $arrq = pg_fetch_all($result_query);
             // print_r($arrq);
             // exit();
             $arr = $arrq;
                    $g=implode("",$arr[0]);
                    $geojson=$g;
                    $output['geojson'] = $geojson;
                    
        }
      
        
$this->closeConnection();
        return json_encode($output);

        
    }
}

$json = new Tehsil();
//$json->closeConnection();
echo $json->getquerydata();

