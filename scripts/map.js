var lvdb_l1 = L.layerGroup();
var SFP_L2 = L.layerGroup();
var MFP_L3 = L.layerGroup();
var demand_point = L.layerGroup();
var current_dropdown_cd_id='%';
var current_phase_val='%';
var latlngsarr = Array();
var l1;
var l2;
var l3;
var filter_polylines_arr=Array();
var point_polylines_arr=Array();

   
    var street   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    dark  = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
                    maxZoom: 20,
                    subdomains:['mt0','mt1','mt2','mt3']
                });


var map = L.map('map_div', {
    center: [2.390668368, 102.080687281],
    zoom: 16,
    layers: [googleSat, demand_point],
    attributionControl:false 
});


var baseLayers = {
    "Street": street,
    "Satellite": googleSat,
    "Dark": dark,
};

var overlays = {
    "LVDB_L1&nbsp&nbsp<img src='images/green.png' width='30' height='30'>": lvdb_l1,
    "SFP_L2&nbsp&nbsp<img src='images/pink.png' width='30' height='30'>": SFP_L2,
    "MFP_L3&nbsp&nbsp<img src='images/orange.png' width='30' height='30'>": MFP_L3,
    "Demand Point&nbsp&nbsp<img src='images/layer.jpg' width='30' height='30'>": demand_point,
};

L.control.layers(baseLayers, overlays).addTo(map);


$(document).ready(function(){
    //-----------counts----------
    $.ajax({
        url: "services/get_total_counts_values.php?cd_id=%",
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
          console.log(response)
          $("#sred").text(response.Rsingle[0]["count"]);
          $("#syellow").text(response.Ysingle[0]["count"]);
          $("#tblue").text(response.Bthree[0]["count"]);
          $("#tryb").text(response.RYBthree[0]["count"]);

        }
    });
    setTimeout(function(){
         //-----------fp dropdown ids----------  
        $.ajax({
            url: "services/get_dropdn_values.php",
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(data) {
                // var r=JSON.parse(response)
            console.log(data.fp)
            for(var i=0;i<data.fp.length;i++){
                $('select[name="fp"]').append('<option value="'+ data.fp[i].cd_id +'">'+ data.fp[i].id+' '+data.fp[i].pe_name+'</option>');
            }
            for(var i=0;i<data.sfp.length;i++){
                $('select[name="sfp"]').append('<option value="'+ data.sfp[i].cd_id +'">'+ data.fp[i].id+' '+data.fp[i].pe_name+'</option>');
            }
            for(var i=0;i<data.mfp.length;i++){
                $('select[name="mfp"]').append('<option value="'+ data.mfp[i].cd_id +'">'+ data.fp[i].id+' '+data.fp[i].pe_name+'</option>');
            }


            }
        });
        //-----------geojson of layers----------  
        $.ajax({
            url: "services/get_lvdb_l1_geojson.php",
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                
                // var r=JSON.parse(response)
            
             lvdb_l1=L.geoJSON(response,{
                pointToLayer: function (feature, latlng) {
                    l1=latlng;
                    console.log(latlng)
                    return L.circleMarker(latlng, {
                        radius: 15,
                        fillColor: "green",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                },
                onEachFeature: function (feature, layer) {
                    var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                    str = str + '<tr><td> ID </td><td>' + feature.properties.id  + '</td></tr>';
                    str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                    str = str + '<tr><td> image_1  </td><td><a href="'+feature.properties.image_1 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_1  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image_2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_2  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image_3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_3  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image_4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_4  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image_5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_5  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_6  </td><td><a href="'+feature.properties.image_6 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_6  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_7  </td><td><a href="'+feature.properties.image_7 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_7  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_8  </td><td><a href="'+feature.properties.image_8 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_8  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_9  </td><td><a href="'+feature.properties.image_9 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_9  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_10 </td><td><a href="'+feature.properties.image_10+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_10 + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '</table></div>'
                    // var popupText = "<b>status:</b> " + feature.properties.status +
                    //             "<br><b>pe_name:</b> " + feature.properties.pe_name+
                    //             "<br><b>Latitude:</b> " + response.features[0].geometry.coordinates[0][0]+"  <b>Longitude:</b> " + response.features[0].geometry.coordinates[0][1] 
                    layer.bindPopup(str);
                    layer.on('click', function (e) {
                        if (filter_polylines_arr !== undefined && filter_polylines_arr.length !== 0) {
                            for(var i=0; i<filter_polylines_arr.length; i++){
                                map.addLayer(filter_polylines_arr[i])
                            }
                        }
                    });
                }
            }).addTo(lvdb_l1)

            }
        });
        $.ajax({
            url: "services/get_SFP_L2_geojson.php",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                
            SFP_L2=L.geoJSON(response,{
                pointToLayer: function (feature, latlng) {
                    l2=latlng;
                    return L.circleMarker(latlng, {
                        radius: 15,
                        fillColor: "#f04ea0",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                },
                onEachFeature: function (feature, layer) {
                    var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                    str = str + '<tr><td> ID </td><td>' + feature.properties.id  + '</td></tr>';
                    str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                    str = str + '<tr><td> image_1  </td><td><a href="'+feature.properties.image_1 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_1  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image_2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_2  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image_3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_3  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image_4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_4  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image_5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_5  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_6  </td><td><a href="'+feature.properties.image_6 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_6  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_7  </td><td><a href="'+feature.properties.image_7 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_7  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_8  </td><td><a href="'+feature.properties.image_8 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_8  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_9  </td><td><a href="'+feature.properties.image_9 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_9  + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '<tr><td> image_10 </td><td><a href="'+feature.properties.image_10+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_10 + '" width="20px" height="20px"></a></td></tr>'
                    str = str + '</table></div>'
                    // var popupText = "<b>status:</b> " + feature.properties.status +
                    //             "<br><b>pe_name:</b> " + feature.properties.pe_name+
                    //             "<br><b>Latitude:</b> " + response.features[0].geometry.coordinates[0][0]+"  <b>Longitude:</b> " + response.features[0].geometry.coordinates[0][1] 
                    layer.bindPopup(str);
                    layer.on('click', function (e) {
                        if (filter_polylines_arr !== undefined && filter_polylines_arr.length !== 0) {
                            for(var i=0; i<filter_polylines_arr.length; i++){
                                map.addLayer(filter_polylines_arr[i])
                            }
                        }
                    });
                }
            }).addTo(SFP_L2)

            }
        });
        $.ajax({
            url: "services/get_MFP_L3_geojson.php",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                console.log(response)
                MFP_L3=L.geoJSON(response,{
                    pointToLayer: function (feature, latlng) {
                        l3=latlng;
                        console.log(latlng)
                        return L.circleMarker(latlng, {
                            radius: 15,
                            fillColor: "#F26822",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    },
                    onEachFeature: function (feature, layer) {
                        var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                        str = str + '<tr><td> ID </td><td>' + feature.properties.id  + '</td></tr>';
                        str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                        str = str + '<tr><td> image_1  </td><td><a href="'+feature.properties.image_1 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_1  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image_2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_2  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image_3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_3  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image_4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_4  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image_5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_5  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_6  </td><td><a href="'+feature.properties.image_6 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_6  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_7  </td><td><a href="'+feature.properties.image_7 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_7  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_8  </td><td><a href="'+feature.properties.image_8 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_8  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_9  </td><td><a href="'+feature.properties.image_9 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_9  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_10 </td><td><a href="'+feature.properties.image_10+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_10 + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '</table></div>'
                        // var popupText = "<b>status:</b> " + feature.properties.status +
                        //             "<br><b>pe_name:</b> " + feature.properties.pe_name+
                        //             "<br><b>Latitude:</b> " + response.features[0].geometry.coordinates[0][0]+"  <b>Longitude:</b> " + response.features[0].geometry.coordinates[0][1] 
                        layer.bindPopup(str);

                        layer.on('click', function (e) {
                            if (filter_polylines_arr !== undefined && filter_polylines_arr.length !== 0) {
                                for(var i=0; i<filter_polylines_arr.length; i++){
                                    map.addLayer(filter_polylines_arr[i])
                                }
                            }
                        });

                    }
                }).addTo(MFP_L3)

            }
        });
        $.ajax({
            url: "services/get_demand_point_geojson.php?cd_id="+current_dropdown_cd_id + "&fd_no=%"+ "&phase=" + current_phase_val,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                console.log(response);
                demand_point=L.geoJSON(JSON.parse(response.geojson),{
                    pointToLayer: function (feature, latlng) {
                    if(feature.properties.phase == "R"){
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "red",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }
                    if(feature.properties.phase == "Y"){
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "yellow",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }if(feature.properties.phase == "B"){
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "blue",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }if(feature.properties.phase == "RYB"){
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "#51D1E1",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }else{
                        return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "black",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                    }
                    },
                    onEachFeature: function (feature, layer) {
                        var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                        str = str + '<tr><td> ID </td><td>' + feature.properties.id  + '</td></tr>';
                        str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                        str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
                        str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
                        str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                        str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
                        str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
                        str = str + '<tr><td> image  </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '</table></div>'
                        layer.bindPopup(str);

                        layer.on('click', function (e) {
                            if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                                for(var i=0; i<point_polylines_arr.length; i++){
                                    map.removeLayer(point_polylines_arr[i])
                                }
                            }
                            // map.removeLayer(demand_point)
                            feature_point=layer.toGeoJSON();
                            console.log(feature_point);
                            let arr = Array();
                            arr.push([feature_point.geometry.coordinates[0][1], feature_point.geometry.coordinates[0][0]])
							if(feature_point.properties.l3_id=='1'){
                                map.addLayer(MFP_L3)
                                $("#MFP_L3").prop("checked", true);
                                arr.push(l3);
                            }
                            if(feature_point.properties.l3_id=='2'){
                                map.addLayer(MFP_L3)
                                $("#MFP_L3").prop("checked", true);
                                arr.push([2.390839101,102.081263347])
                            }
							if(feature_point.properties.l2_id=='1' || feature_point.properties.l2_id=='2'){
                                map.addLayer(SFP_L2)
                                $("#SFP_L2").prop("checked", true);
                                arr.push(l2);
                            }
                            if(feature_point.properties.l1_id=='1' || feature_point.properties.l1_id=='2'){
                                map.addLayer(lvdb_l1)
                                $("#lvdb_l1").prop("checked", true);
                                arr.push(l1);
                            }
                            
                            
                            var polyline = L.polyline(arr, {color: 'green', weight: '8'}).addTo(map);
                            point_polylines_arr.push(polyline);
                            
                        });
                    }
                }).addTo(demand_point)
            }
        });
       
       
}, 2000);
});
//-----------add remove geojson----------  
function addRemoveLayer(name){
    if(name=='lvdb_l1'){
            var ckb = $("#lvdb_l1").is(':checked');
            if(ckb==true){
                map.addLayer(lvdb_l1)
            }else{
                 map.removeLayer(lvdb_l1)
            }
        }

    if(name=='SFP_L2'){
        var ckb = $("#SFP_L2").is(':checked');
        if(ckb==true){
        
            map.addLayer(SFP_L2)
        }else{
            map.removeLayer(SFP_L2)
        }
    }
    if(name=='MFP_L3'){
        var ckb = $("#MFP_L3").is(':checked');
        if(ckb==true){
        
            map.addLayer(MFP_L3)
        }else{
            map.removeLayer(MFP_L3)
        }
    }

    if(name=='demand_point'){
        var ckb = $("#demand_point").is(':checked');
        if(ckb==true){
        
            map.addLayer(demand_point)
        }else{
            if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                for(var i=0; i<point_polylines_arr.length; i++){
                    map.removeLayer(point_polylines_arr[i])
                }
            }
            map.removeLayer(demand_point)
        }
    }
}


//-----------on change fp dropdown----------  
$('select[name="fp"]').on('change',function(e){
    e.preventDefault();
    var cd_id= $(this).val();
    map.removeLayer(demand_point)
    map.removeLayer(lvdb_l1)
    map.removeLayer(SFP_L2)
    map.removeLayer(MFP_L3)
    $("#sred").text('');
    $("#syellow").text('');
    $("#tblue").text('');
    $("#tryb").text('');

    $(".chk").prop("checked", false);
    $("#demand_point").prop("checked", true);
    
    $("#sfp").val('0');
    $("#mfp").val('0');

    $('#fd_details_div').show();

    current_dropdown_cd_id=cd_id;
    loadfilterdata(cd_id); 
});

$('select[name="sfp"]').on('change',function(e){
    e.preventDefault();
    var cd_id= $(this).val();
    map.removeLayer(demand_point)
    map.removeLayer(lvdb_l1)
    map.removeLayer(SFP_L2)
    map.removeLayer(MFP_L3)
    $("#sred").text('');
    $("#syellow").text('');
    $("#tblue").text('');
    $("#tryb").text('');

    $(".chk").prop("checked", false);
    $("#demand_point").prop("checked", true);
    
    $("#fp").val('0');
    $("#mfp").val('0');

    $('#fd_details_div').show();

    current_dropdown_cd_id=cd_id;
    loadfilterdata(cd_id);
});
$('select[name="mfp"]').on('change',function(e){
    e.preventDefault();
    var cd_id= $(this).val();
    map.removeLayer(demand_point)
    map.removeLayer(lvdb_l1)
    map.removeLayer(SFP_L2)
    map.removeLayer(MFP_L3)

    $("#sred").text('');
    $("#syellow").text('');
    $("#tblue").text('');
    $("#tryb").text('');

    $(".chk").prop("checked", false);
    $("#demand_point").prop("checked", true);
    
    $("#fp").val('0');
    $("#sfp").val('0');

    $('#fd_details_div').show();

    current_dropdown_cd_id=cd_id;
    loadfilterdata(cd_id);
    
});



$('.maincountdiv').on('click',function(){
    var phase_val = $(this).attr("id");
            // console.log(phase_val)
            if(phase_val=="R"){
                $('.fd_p').css({'background': '#EF5350'});
            }
            if(phase_val=="Y"){
                $('.fd_p').css({'background': '#FFC107'});
            }
            if(phase_val=="B"){
                $('.fd_p').css({'background': '#007BFF'});
            }
            if(phase_val=="RYB"){
                $('.fd_p').css({'background': '#26C6DA'});
            }

    $.ajax({
        url : 'services/get_fd_counts.php?phase='+phase_val + "&cd_id=" + current_dropdown_cd_id,
        type : "GET",
        success:function(d){
            console.log(d);
            var data = JSON.parse(d);
            console.log(data);
            for(var j=1;j<=12;j++){
                $("#fd_"+j).text(0);  
            }
            for(var i=0; i<data.length; i++){ 
                $("#fd_"+data[i].fd_no).text(data[i].count);
            }
            current_phase_val=phase_val;
        }
    });
});

$('.fd_p').on('click',function(){
    var id = $(this).attr("id");
    var fd_no=id.replace("fd_p", "");

    map.removeLayer(demand_point)
    map.removeLayer(lvdb_l1)
    map.removeLayer(SFP_L2)
    map.removeLayer(MFP_L3)
    console.log(current_phase_val+','+fd_no)
    $.ajax({
        url: "services/get_demand_point_geojson.php?cd_id="+current_dropdown_cd_id + "&fd_no=" + fd_no+ "&phase=" + current_phase_val,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
            console.log(response)
            
            get_filtered_dp_geojson(response)

            $(".chk").prop("checked", false);
            $("#demand_point").prop("checked", true);
        }
    });
});

function loadfilterdata(cd_id){
    $.ajax({
        url: "services/get_demand_point_geojson.php?cd_id="+cd_id + "&fd_no=%"+ "&phase=%",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
       
            get_filtered_dp_geojson(response)
        }
    });
    $.ajax({
        url: "services/get_total_counts_values.php?cd_id="+cd_id,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
          $("#sred").text(response.Rsingle[0]["count"]);
          $("#syellow").text(response.Ysingle[0]["count"]);
          $("#tblue").text(response.Bthree[0]["count"]);
          $("#tryb").text(response.RYBthree[0]["count"]);

        }
    });
}

function get_filtered_dp_geojson(response){

    if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
        for(var i=0; i<point_polylines_arr.length; i++){
            map.removeLayer(point_polylines_arr[i])
        }
    }
    
    // map.removeLayer(polyline)
    if (filter_polylines_arr.length !== 0) {
        for(var i=0; i<filter_polylines_arr.length; i++){
            map.removeLayer(filter_polylines_arr[i])
        }
    }
    filter_polylines_arr=[];

    if(response.incoming){
        var incoming=response.incoming[0];
    }
    demand_point=L.geoJSON(JSON.parse(response.geojson),{
        pointToLayer: function (feature, latlng) {
             let arr = Array();
            if(current_dropdown_cd_id =='a111' || current_dropdown_cd_id =='a222'){
                map.addLayer(lvdb_l1)
                $("#lvdb_l1").prop("checked", true);
                arr.push(l1);
            }
            if(current_dropdown_cd_id =='a333' || current_dropdown_cd_id =='a444'){
                map.addLayer(SFP_L2)
                $("#SFP_L2").prop("checked", true);
                arr.push(l2);
            }
            if(current_dropdown_cd_id =='a555'){
                map.addLayer(MFP_L3)
                $("#MFP_L3").prop("checked", true);
                arr.push(l3);
               
            }
            if(current_dropdown_cd_id =='a666'){
                map.addLayer(MFP_L3)
                $("#MFP_L3").prop("checked", true);
                // {lat: 2.392597492, lng: 102.078805727}
                arr.push([2.390839101,102.081263347])
                
            }
            arr.push(latlng);
                 var polyline = L.polyline(arr, {color: 'red'});
                 filter_polylines_arr.push(polyline);
        
        if(feature.properties.phase == "R"){
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "red",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
        if(feature.properties.phase == "Y"){
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "yellow",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }if(feature.properties.phase == "B"){
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "blue",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }if(feature.properties.phase == "RYB"){
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#51D1E1",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }else{
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "black",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
        },
        onEachFeature: function (feature, layer) {

            if(current_dropdown_cd_id !='a111' && current_dropdown_cd_id !='a222'){
                var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                str = str + '<tr><td> ID </td><td>' + feature.properties.id  + '</td></tr>';
                str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
                str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
                str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
                str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
                str = str + '<tr><td> lvf1_fd  </td><td>' + incoming.lvf1_fd  + '</td></tr>'
                str = str + '<tr><td> lvf2_fd  </td><td>' + incoming.lvf2_fd  + '</td></tr>'
                str = str + '<tr><td> image  </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
                str = str + '</table></div>'
                layer.bindPopup(str);
            }
            else{
                var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                str = str + '<tr><td> ID </td><td>' + feature.properties.id  + '</td></tr>';
                str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
                str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
                str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
                str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
                str = str + '<tr><td> image  </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
                str = str + '</table></div>'
                layer.bindPopup(str);
            }
			
			 layer.on('click', function (e) {
                            if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                                for(var i=0; i<point_polylines_arr.length; i++){
                                    map.removeLayer(point_polylines_arr[i])
                                }
                            }
                            // map.removeLayer(demand_point)
                            feature_point=layer.toGeoJSON();
                            console.log(feature_point);
                            let arr = Array();
                            arr.push([feature_point.geometry.coordinates[0][1], feature_point.geometry.coordinates[0][0]])
							if(feature_point.properties.l3_id=='1'){
                                map.addLayer(MFP_L3)
                                $("#MFP_L3").prop("checked", true);
                                arr.push(l3);
                            }
                            if(feature_point.properties.l3_id=='2'){
                                map.addLayer(MFP_L3)
                                $("#MFP_L3").prop("checked", true);
                                arr.push([2.390839101,102.081263347])
                            }
							if(feature_point.properties.l2_id=='1' || feature_point.properties.l2_id=='2'){
                                map.addLayer(SFP_L2)
                                $("#SFP_L2").prop("checked", true);
                                arr.push(l2);
                            }
                            if(feature_point.properties.l1_id=='1' || feature_point.properties.l1_id=='2'){
                                map.addLayer(lvdb_l1)
                                $("#lvdb_l1").prop("checked", true);
                                arr.push(l1);
                            }
                            
                            
                            var polyline = L.polyline(arr, {color: 'green', weight: '8'}).addTo(map);
                            point_polylines_arr.push(polyline);
                            
                        });
            
        }
        
    }).addTo(map);
  
    

}

// $('#filterbtn').on('click',function(){

//     var fdatarr={
//             // page: page,
//             phase_color: $('#phase_color').val(),
//             fp: $('#fp').val(),
//             sfp: $('#sfp').val(),
//             mfp: $('#mfp').val(),
//         };
//             console.log(fdatarr)
//     $.ajax({
//         url : 'services/filterdata.php?fdatarr='+JSON.stringify(fdatarr),
//         type : "GET",
//         success:function(data){
//             console.log(data);
//         }
//     });
// });




// $('select[name="phase_color"]').on('change',function(e){
//     e.preventDefault();
//     var phase_color= $(this).val();
//     // console.log(phase_color);
//     if(phase_color)
//     {
//         $.ajax({
//             url : 'services/get_fp_device_ids.php?phase_color='+phase_color,
//             type : "GET",
//             dataType : "json",
//             success:function(data){
//                 console.log(data);
//                 $('select[name="fp"]').empty();
//                 for(var i=0;i<data.length;i++){
//                     $('select[name="fp"]').append('<option value="'+ data[i].device_id +'">'+ data[i].device_id +'</option>');
//                 }
//             }
//         });
//     }
//     else
//     {
//         $('select[name="fp"]').empty();
//     }
// });






