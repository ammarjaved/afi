var lvdb_l1 = L.layerGroup();
var SFP_L2 = L.layerGroup();
var MFP_L3 = L.layerGroup();
var demand_point = L.layerGroup();
var current_dropdown_Lid='%';
var current_phase_val='%';
var latlngsarr = Array();
var l1;
var l2;
var l3;
var filter_polylines_arr=Array();
var point_polylines_arr=Array();
var line_l1_l2_l3_markers = L.layerGroup();

   
    var street   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    dark  = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
                    maxZoom: 20,
                    subdomains:['mt0','mt1','mt2','mt3']
                });

    var dpns = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/cite/wms", {
        layers: 'cite:demand_point_not_surveyed',
        format: 'image/png',
        maxZoom: 20,
        transparent: true
    });
var map = L.map('map_div', {
    center: [2.390668368, 102.080687281],
    // center: [31.5204, 74.3587],
    zoom: 9,
    layers: [googleSat, demand_point, dpns],
    attributionControl:false 
});

function getFeatureInfoUrl(map, layer, latlng, params) {

    var point = map.latLngToContainerPoint(latlng, map.getZoom()),
        size = map.getSize(),

        params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: layer.wmsParams.styles,
            transparent: layer.wmsParams.transparent,
            version: layer._wmsVersion,
            format:layer.wmsParams.format,
            bbox: map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: layer.wmsParams.layers,
            query_layers: layer.wmsParams.layers,
            info_format: 'application/json'
        };

    params[params.version === '1.3.0' ? 'i' : 'x'] = parseInt(point.x);
    params[params.version === '1.3.0' ? 'j' : 'y'] = parseInt(point.y);

    // return this._url + L.Util.getParamString(params, this._url, true);

    var url = layer._url + L.Util.getParamString(params, layer._url, true);
    if(typeof layer.wmsParams.proxy !== "undefined") {


        // check if proxyParamName is defined (instead, use default value)
        if(typeof layer.wmsParams.proxyParamName !== "undefined")
            layer.wmsParams.proxyParamName = 'url';

        // build proxy (es: "proxy.php?url=" )
        _proxy = layer.wmsParams.proxy + '?' + layer.wmsParams.proxyParamName + '=';

        url = _proxy + encodeURIComponent(url);

    }

    return url.toString();

}
function getProperties(layer){


    map.on('click', function(e) {
     //   map.off('click');

        // Build the URL for a GetFeatureInfo
        var url = getFeatureInfoUrl(
            map,
            layer,
            e.latlng,
            {
                'info_format': 'application/json',
                'propertyName': 'NAME,AREA_CODE,DESCRIPTIO'
            }
        );
        $.ajax({
            url: 'services/proxy.php?url='+encodeURIComponent(url),
            dataType: 'JSON',
            //data: data,
            method: 'GET',
            async: false,
            success: function callback(data) {
                console.log(data.features[0].properties.acc_no)
                var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                str = str + '<tr><td> Account No. </td><td>' + data.features[0].properties.acc_no + '</td></tr>';
                str = str + '<tr><td> pe_name  </td><td>' + data.features[0].properties.pe_name  + '</td></tr>'
                str = str + '<tr><td> cd_id  </td><td>' + data.features[0].properties.cd_id  + '</td></tr>'
                str = str + '<tr><td> fd_no  </td><td>' + data.features[0].properties.fd_no  + '</td></tr>'
                str = str + '<tr><td> l1_id  </td><td>' + data.features[0].properties.l1_id  + '</td></tr>'
                str = str + '<tr><td> l2_id  </td><td>' + data.features[0].properties.l2_id  + '</td></tr>'
                str = str + '<tr><td> l3_id  </td><td>' + data.features[0].properties.l3_id  + '</td></tr>'
                str = str + '<tr><td> image  </td><td><a href="'+data.features[0].properties.image2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + data.features[0].properties.image2 + '" width="20px" height="20px"></a></td></tr>'
                str = str + '</table></div>'
                $("#modalbody_id").html(str)

            }
        });
        $('#nonsurvedmodal').modal('show');
    });
    
}

        

var baseLayers = {
    "Street": street,
    "Satellite": googleSat,
    "Dark": dark,
};

var overlays = {
    "FPL_L1&nbsp&nbsp<img src='images/1.png' width='30' height='30'>": lvdb_l1,
    "SFP_L2&nbsp&nbsp<img src='images/2.png' width='30' height='30'>": SFP_L2,
    "MFP_L3&nbsp&nbsp<img src='images/3.png' width='30' height='30'>": MFP_L3,
    "Surveyed Demand Points &nbsp&nbsp<img src='images/layer.jpg' width='30' height='30'>": demand_point,
    "Non Surveyed D/P": dpns,
};

L.control.layers(baseLayers, overlays).addTo(map);


var Icon1 = L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/1.png',
    iconSize:     [35, 35] // size of the icon
});
var Icon2 = L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/2.png',
    iconSize:     [35, 35] // size of the icon
});
var Icon3 = L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/3.png',
    iconSize:     [35, 35] // size of the icon
});
var ryb= L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/ryb.png',
    iconSize:     [25, 25] // size of the icon
});

function fillDropDowns(di,lyr){
    
    $.ajax({
        url: "services/get_dropdn_values.php?lyr="+lyr+"&di="+di,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(data) {
            // var r=JSON.parse(response)
            if(lyr=='fp'){
                $('.load_options').remove();
                console.log(data.fp)
                for(var i=0;i<data.length;i++){
                    $('select[name="fp"]').append('<option value="'+ data[i].l1_id +'">'+data[i].l1_id+' ('+data[i].pe_name+')'+'</option>');
                }
            }else if(lyr=='sfp'){
                for(var i=0;i<data.length;i++){  
                    $('select[name="sfp"]').append('<option class="load_options" value="'+ data[i].l2_id +'">'+data[i].l2_id+' ( '+data[i].pe_name+')'+'</option>');
                }
            }else if(lyr=='mfp') {
                for (var i = 0; i < data.length; i++) {
                    $('select[name="mfp"]').append('<option class="load_options" value="' + data[i].l3_id + '">' + data[i].l3_id+' ('+data[i].pe_name+')'+'</option>');
                }
            }
        }
    });
}


$(document).ready(function(){
    //-----------counts----------
    $.ajax({
        url: "services/get_total_counts_values.php?lid=%",
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
          console.log(response)
          $("#sred").text(response.Rsingle[0]["count"]);
          $("#syellow").text(response.Ysingle[0]["count"]);
          $("#sblue").text(response.Bsingle[0]["count"]);
          $("#tryb").text(response.RYBthree[0]["count"]);

        }
    });
    setTimeout(function(){
        getProperties(dpns)
         //-----------fp dropdown ids----------  
        fillDropDowns('%','fp')
      
        //-----------geojson of layers----------  
        $.ajax({
            url: "services/get_lvdb_l1_geojson.php?l1_id=%",
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                
                // var r=JSON.parse(response)
            
             lvdb_l1=L.geoJSON(response,{
                pointToLayer: function (feature, latlng) {
                    l1=latlng;
                    // console.log(latlng)
                    // return L.circleMarker(latlng, {
                    //     radius: 15,
                    //     lineCap: "round",
                    //     fillColor: "green",
                    //     color: "#000",
                    //     weight: 1,
                    //     opacity: 1,
                    //     fillOpacity: 0.8
                    // });
                    return L.marker(latlng, {icon: Icon1});
                },
                onEachFeature: function (feature, layer) {
                    var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                    str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
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
            url: "services/get_SFP_L2_geojson.php?l2_id=%",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                
            SFP_L2=L.geoJSON(response,{
                pointToLayer: function (feature, latlng) {
                    l2=latlng;
                    return L.marker(latlng, {icon: Icon2});
                },
                onEachFeature: function (feature, layer) {
                    var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                    str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
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
            url: "services/get_MFP_L3_geojson.php?l3_id=%",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                console.log(response)
                MFP_L3=L.geoJSON(response,{
                    pointToLayer: function (feature, latlng) {
                        l3=latlng;
                        // console.log(latlng)
                        return L.marker(latlng, {icon: Icon3});
                    },
                    onEachFeature: function (feature, layer) {
                        var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                        str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
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
            url: "services/get_demand_point_geojson.php?lid="+current_dropdown_Lid + "&fd_no=%"+ "&phase=" + current_phase_val,
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
                                fillColor: "#007BFF",
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }if(feature.properties.phase == "RYB"){
                            return L.marker(latlng, {icon: ryb});
                        }else{
                            return L.circleMarker(latlng, {
                                radius: 8,
                                fillColor: "white",
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }
                    },
                    onEachFeature: function (feature, layer) {
                        var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                        str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
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
                            map.removeLayer(line_l1_l2_l3_markers);
                            if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                                for(var i=0; i<point_polylines_arr.length; i++){
                                    map.removeLayer(point_polylines_arr[i]);
                                }
                            }
                            
                            // map.removeLayer(demand_point)
                            feature_point=layer.toGeoJSON();
                            // console.log(feature_point);
                            let arr = Array();
                            arr.push([feature_point.geometry.coordinates[0][1], feature_point.geometry.coordinates[0][0]])
                            if(feature_point.properties.l3_id){
                                var l3_id=feature_point.properties.l3_id
                                $.ajax({
                                    url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
                                    type: "GET",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    success: function callback(response) {
                                         // console.log(response);
                                         arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                                         var latlng3=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                                         L.marker(latlng3, {icon: Icon3}).addTo(line_l1_l2_l3_markers);
                                     }
                                })
                            }
                            if(feature_point.properties.l2_id){
                                var l2_id=feature_point.properties.l2_id
                                $.ajax({
                                    url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
                                    type: "GET",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    success: function callback(response) {
                                        // console.log(response);
                                        arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                                        var latlng2=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                                        L.marker(latlng2, {icon: Icon2}).addTo(line_l1_l2_l3_markers);
                                    }
                                })
                            }
							if(feature_point.properties.l1_id){
                                var l1_id=feature_point.properties.l1_id
                                $.ajax({
                                    url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
                                    type: "GET",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    success: function callback(response) {
                                        // console.log(response);
                                        arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                                        var latlng1=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                                        L.marker(latlng1, {icon: Icon1}).addTo(line_l1_l2_l3_markers);
                                    }
                                })
                            }
							
							
                            setTimeout(function(){ 
                                // var polyline = L.polyline(arr, {color: 'white', weight: '8'}).addTo(map);
                                var polyline = L.polyline(arr);
                                setPolylineColors(polyline,['yellow','pink','green'])
                                line_l1_l2_l3_markers.addTo(map);
                                // point_polylines_arr.push(polyline);
                             }, 400);
                            
                            
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

    console.log(demand_point)
    // function fp_zoom_to_feature(did){
    //     gj= JSON.parse(geojsonfromhiddenfld)
    //      for(var i=0;i<gj.features.length;i++){if(gj.features[i].properties.device_id==did){map.setView([gj.features[i].geometry.coordinates[1],gj.features[i].geometry.coordinates[0]],17)}}
    //      // console.log(did)
    //      // console.log(geojsonfromhiddenfld)
         
    //  }
    e.preventDefault();
    var l1_id= $(this).val();
    fillDropDowns(l1_id,'sfp')
    $("#sred").text('');
    $("#syellow").text('');
    $("#sblue").text('');
    $("#tryb").text('');

    $('#fd_details_div').show();
    current_dropdown_Lid=l1_id;
    loadfilterdata(l1_id); 
});

$('select[name="sfp"]').on('change',function(e){
    e.preventDefault();
    var l2id= $(this).val();
    fillDropDowns(l2id,'mfp')
    $("#sred").text('');
    $("#syellow").text('');
    $("#sblue").text('');
    $("#tryb").text('');

    $('#fd_details_div').show();

    current_dropdown_Lid=l2id;
    loadfilterdata(l2id);
});
$('select[name="mfp"]').on('change',function(e){
    e.preventDefault();
    var l3id= $(this).val();
    $("#sred").text('');
    $("#syellow").text('');
    $("#sblue").text('');
    $("#tryb").text('');
    // just blank show fd_details_div
    $('#fd_details_div').show();

    current_dropdown_Lid=l3id;
    loadfilterdata(l3id);
    
});


// now filling color and values to fd_details_div
$('.countdiv').on('click',function(){
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
                $('.fd_p').css({'background': '#7d26cd'});
            }

    $.ajax({
        url : 'services/get_fd_counts.php?phase='+phase_val + "&lid=" + current_dropdown_Lid,
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

    // map.removeLayer(demand_point)
    // console.log(current_phase_val+','+fd_no)
    $.ajax({
        url: "services/get_demand_point_geojson.php?lid="+current_dropdown_Lid + "&fd_no=" + fd_no+ "&phase=" + current_phase_val,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
            console.log(response)
            get_filtered_dp_geojson(response)
        }
    });
});

function loadfilterdata(lid){
    $.ajax({
        url: "services/get_demand_point_geojson.php?lid="+lid + "&fd_no=%"+ "&phase=%",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
       
            get_filtered_dp_geojson(response)
        }
    });
    $.ajax({
        url: "services/get_total_counts_values.php?lid="+lid,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
          $("#sred").text(response.Rsingle[0]["count"]);
          $("#syellow").text(response.Ysingle[0]["count"]);
          $("#sblue").text(response.Bsingle[0]["count"]);
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

    map.removeLayer(demand_point)
    map.removeLayer(line_l1_l2_l3_markers)
    demand_point=L.geoJSON(JSON.parse(response.geojson),{
        pointToLayer: function (feature, latlng) {
            map.removeLayer(line_l1_l2_l3_markers)
            feature_point=feature;
            // console.log(feature_point);
            let arr = Array();
            // arr.push([feature_point.geometry.coordinates[0][1], feature_point.geometry.coordinates[0][0]])
            if(feature_point.properties.l3_id){
                var l3_id=feature_point.properties.l3_id
                $.ajax({
                    url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
                    type: "GET",
                    async: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function callback(response) {
                         // console.log(response);
                         arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                         var latlng3=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                         L.marker(latlng3, {icon: Icon3}).addTo(line_l1_l2_l3_markers);
                     }
                })
            }
            if(feature_point.properties.l2_id){
                var l2_id=feature_point.properties.l2_id
                $.ajax({
                    url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
                    type: "GET",
                    async: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function callback(response) {
                        // console.log(response);
                        arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                        var latlng2=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                        L.marker(latlng2, {icon: Icon2}).addTo(line_l1_l2_l3_markers);
                    }
                })
            }
            if(feature_point.properties.l1_id){
                var l1_id=feature_point.properties.l1_id
                $.ajax({
                    url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
                    type: "GET",
                    async: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function callback(response) {
                        // console.log(response);
                        arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                        var latlng1=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                        L.marker(latlng1, {icon: Icon1}).addTo(line_l1_l2_l3_markers);
                    }
                })
            }
            arr.push(latlng);
            var polyline = L.polyline(arr, {color: 'red'});
            filter_polylines_arr.push(polyline);

            if (filter_polylines_arr !== undefined && filter_polylines_arr.length !== 0) {
                for(var i=0; i<filter_polylines_arr.length; i++){
                    map.addLayer(filter_polylines_arr[i])
                }
            }

            line_l1_l2_l3_markers.addTo(map);
            
            // setTimeout(function(){ 
            //     var polyline = L.polyline(arr);
            //     setPolylineColors(polyline,['yellow','pink','green'])
            //     line_l1_l2_l3_markers.addTo(map);
               
            //  }, 400);
        
        
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
                return L.marker(latlng, {icon: ryb});
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

            if(current_dropdown_Lid !='a111' && current_dropdown_Lid !='a222'){
                var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
                str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
                str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
                str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
                str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
                // str = str + '<tr><td> lvf1_fd  </td><td>' + incoming.lvf1_fd  + '</td></tr>'
                // str = str + '<tr><td> lvf2_fd  </td><td>' + incoming.lvf2_fd  + '</td></tr>'
                str = str + '<tr><td> image  </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
                str = str + '</table></div>'
                layer.bindPopup(str);
            }
            else{
                var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
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
                map.removeLayer(line_l1_l2_l3_markers);
                if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                    for(var i=0; i<point_polylines_arr.length; i++){
                        map.removeLayer(point_polylines_arr[i]);
                    }
                }
                
                // map.removeLayer(demand_point)
                feature_point=layer.toGeoJSON();
                // console.log(feature_point);
                let arr = Array();
                arr.push([feature_point.geometry.coordinates[0][1], feature_point.geometry.coordinates[0][0]])
                if(feature_point.properties.l3_id){
                    var l3_id=feature_point.properties.l3_id
                    $.ajax({
                        url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function callback(response) {
                             // console.log(response);
                             arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                             var latlng3=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                             L.marker(latlng3, {icon: Icon3}).addTo(line_l1_l2_l3_markers);
                         }
                    })
                }
                if(feature_point.properties.l2_id){
                    var l2_id=feature_point.properties.l2_id
                    $.ajax({
                        url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function callback(response) {
                            // console.log(response);
                            arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                            var latlng2=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                            L.marker(latlng2, {icon: Icon2}).addTo(line_l1_l2_l3_markers);
                        }
                    })
                }
                if(feature_point.properties.l1_id){
                    var l1_id=feature_point.properties.l1_id
                    $.ajax({
                        url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function callback(response) {
                            // console.log(response);
                            arr.push([response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]])
                            var latlng1=[response.features[0].geometry.coordinates[0][1], response.features[0].geometry.coordinates[0][0]]
                            L.marker(latlng1, {icon: Icon1}).addTo(line_l1_l2_l3_markers);
                        }
                    })
                }
                
                
                setTimeout(function(){ 
                    var polyline = L.polyline(arr);
                    setPolylineColors(polyline,['yellow','pink','green'])
                    line_l1_l2_l3_markers.addTo(map);
                   
                 }, 400);

                
                
            });
            
        }
        
    }).addTo(demand_point)

    demand_point.addTo(map);
  
}


function setPolylineColors(line,colors){
  
    var latlngs = line.getLatLngs();
  
  latlngs.forEach(function(latlng, idx){
          if(idx+1 < latlngs.length ){
           var polyline =  L.polyline([latlng,latlngs[idx+1]],{color: colors[idx]}).addTo(map);
           point_polylines_arr.push(polyline);
       }
  })
}

// function retur_nmarker_and_color(latlng, color) {
//     return L.circleMarker(latlng, {
//         radius: 8,
//         fillColor: color,
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     });
// }

// if(feature.properties.phase == "R"){
//     var color="R"
//     retur_nmarker_and_color(latlng, color)
// }if(feature.properties.phase == "Y"){
//     var color="Y"
//     retur_nmarker_and_color(latlng, color)
// }if(feature.properties.phase == "B"){
//     var color="B"
//     retur_nmarker_and_color(latlng, color)
// }if(feature.properties.phase == "RYB"){
//     var color="RYB"
//     retur_nmarker_and_color(latlng, color)
// }else{
//     var color="white"
//     retur_nmarker_and_color(latlng, color)
// }

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






