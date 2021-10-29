


<?php
include("connection.php");

class Tehsil extends connection {
    function __construct()
    {
        $this->connectionDB();

    }

    public function getTehsilExtent() {

    $sql = "SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','id',id,'geometry',ST_AsGeoJSON(geom)::json,
            'properties', json_build_object(
            'id', id,
            'p_id', p_id,
            'l3_id', l3_id,
            'status',status ,
            'l2_id',l2_id,
            'l2_fd_no', l2_fd_no,
            'l1_id',l1_id,
            'l1_fd_no', l1_fd_no,
            'pe_name', pe_name,
            'pe_fl', pe_fl,
            'tx1_fl', tx1_fl,
            'tx2_fl',tx2_fl,
            'cd_id', cd_id,
            'lvf1_fd',lvf1_fd, --'lvf1_r', lvf1_r,'lvf1_b', lvf1_b,'lvf1_y', lvf1_y,'lvf1_ryb', lvf1_ryb,
            'lvf2_fd',lvf2_fd, --'lvf2_r', lvf2_r,'lvf2_b', lvf2_b,'lvf2_y', lvf2_y,'lvf2_ryb', lvf2_ryb,
            'lvf3_fd',lvf3_fd, --'lvf3_r', lvf3_r,'lvf3_b', lvf3_b,'lvf3_y', lvf3_y,'lvf3_ryb', lvf3_ryb,
            'lvf4_fd',lvf4_fd, --'lvf4_r', lvf4_r,'lvf4_b', lvf4_b,'lvf4_y', lvf4_y,'lvf4_ryb', lvf4_ryb,
            'lvf5_fd',lvf5_fd, --'lvf5_r', lvf5_r,'lvf5_b', lvf5_b,'lvf5_y', lvf5_y,'lvf5_ryb', lvf5_ryb,
            'lvf6_fd',lvf6_fd, --'lvf6_r', lvf6_r,'lvf6_b', lvf6_b,'lvf6_y', lvf6_y,'lvf6_ryb', lvf6_ryb,
            'lvf7_fd',lvf7_fd, --'lvf7_r', lvf7_r,'lvf7_b', lvf7_b,'lvf7_y', lvf7_y,'lvf7_ryb', lvf7_ryb,
            'lvf8_fd',lvf8_fd, --'lvf8_r', lvf8_r,'lvf8_b', lvf8_b,'lvf8_y', lvf8_y,'lvf8_ryb', lvf8_ryb,
            'lvf9_fd',lvf9_fd, --'lvf9_r', lvf9_r,'lvf9_b', lvf9_b,'lvf9_y', lvf9_y,'lvf9_ryb', lvf9_ryb,
            'lvf10_fd',lvf10_fd, --'lvf10_r', lvf10_r,'lvf10_b', lvf10_b,'lvf10_y', lvf10_y,'lvf10_ryb', lvf10_ryb,
            'lvf11_fd',lvf11_fd, --'lvf11_r', lvf11_r,'lvf11_b', lvf11_b,'lvf11_y', lvf11_y,'lvf11_ryb', lvf11_ryb,
            'lvf12_fd',lvf12_fd, --'lvf12_r', lvf12_r,'lvf12_b', lvf12_b,'lvf12_y', lvf12_y,'lvf12_ryb', lvf12_ryb,
            'total_r', total_r, 'total_y', total_y, 'total_b', total_b, 'total_ryb', total_ryb,
            'image_1', image_1,'image_2', image_2,'image_3', image_3,'image_4', image_4,'image_5', image_5,'image_6', image_6,'image_7', image_7,'image_8', image_8,'image_9', image_9,'image_10', image_10
            ))))
            FROM (SELECT id, p_id, l3_id, status, l2_id, l2_fd_no, l1_id, l1_fd_no, pe_name, pe_fl, tx1_fl, tx2_fl, cd_id, lvf1_fd, lvf1_r, lvf1_y, lvf1_b, lvf1_ryb, lvf2_fd, lvf2_r, lvf2_y, lvf2_b, lvf2_ryb, lvf3_fd, lvf3_r, lvf3_y, lvf3_b, lvf3_ryb, lvf4_fd, lvf4_r, lvf4_y, lvf4_b, lvf4_ryb, lvf5_fd, lvf5_r, lvf5_y, lvf5_b, lvf5_ryb, lvf6_fd, lvf6_r, lvf6_y, lvf6_b, lvf6_ryb, lvf7_fd, lvf7_r, lvf7_y, lvf7_b, lvf7_ryb, lvf8_fd, lvf8_r, lvf8_y, lvf8_b, lvf8_ryb, lvf9_fd, lvf9_r, lvf9_y, lvf9_b, lvf9_ryb, lvf10_fd, lvf10_r, lvf10_y, lvf10_b, lvf10_ryb, lvf11_fd, lvf11_r, lvf11_y, lvf11_b, lvf11_ryb, lvf12_fd, lvf12_r, lvf12_y, lvf12_b, lvf12_ryb, total_r, total_y, total_b, total_ryb, image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9, image_10, geom
                    FROM public.mfp_l3) as tbl1;";

        $output = array();
        $result_query = pg_query($sql);
        if ($result_query) {
             $arrq = pg_fetch_all($result_query);
             // print_r($arrq);
             // exit();
             $arr = json_decode(json_encode($arrq), true);
                    $g=implode("",$arr[0]);
                    $geojson=$g;
                    $output = $geojson;
        }

        return $output;

        $this->closeConnection();
    }
}

$json = new Tehsil();
//$json->closeConnection();
echo $json->getTehsilExtent();

