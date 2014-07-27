//var sWebPath = "http://localhost:56666/";
//var sWebPath = "http://192.168.2.60/";
var sWebPath = window.location.protocol +'//'+ window.location.host+'/';

//Intial Loading stage of the map
function InitialMapLoad(ObjDivID) {
    try {

        if (document.getElementById) /*GBrowserIsCompatible() is not supported in V3  */
        {
            var mapOptions = {
                zoom: 4,
                center: new google.maps.LatLng(0, 0),
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                overviewMapControl: true,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.LEFT_CENTER
                }
            }

            var map = new google.maps.Map(ObjDivID, mapOptions);


            bounds = new google.maps.LatLngBounds();

            var zoomListner = google.maps.event.addListener(map, 'zoom_changed', function () {
                google.maps.event.removeListener(zoomListner);

                var zoomChangeBoundsListener = google.maps.event.addListener(map, 'bounds_changed', function (event) {
                    if (this.getZoom() > 15) // Change max/min zoom here
                        this.setZoom(15);
                    google.maps.event.removeListener(zoomChangeBoundsListener);
                });

            });

            return map;

        }
    }
    catch (e) { }
}



//Pin-Point all the Required Points
function PinPointValues(arrMarker, ObjDivID) {
    try {

        if (arrMarker != null) {

            var marker = null;

            var sMap = InitialMapLoad(ObjDivID);

            var Pt = null;
            var sLat = "";
            var sLng = "";
            var sType = "";
            var IsTab = false;
            var Info = "";
            var arrTabs = new Array();
            var Icon = null;
            var TankID = ""


            $.each(arrMarker, function (i, item) {

                sLat = item.CurrentLatitude;
                sLng = item.CurrentLongitude;

                if (item.IconID == "1") {
                    if (item.IconName != "")
                        sType = item.IconName.replace(".gif", "-Static.png");
                    else
                        sType = "cylindr-2.png";
                }
                else {
                    if (item.IconName != "")
                        sType = item.IconName;
                    else
                        sType = "cylindr-2.png";
                }

                TankID = item.TankID;

                Pt = new google.maps.LatLng(sLat, sLng);
                Icon = CreateIcon(sType, false);
                var mark = null;

                if (item.IsTab)
                    mark = createTabMarkerWithClick(Icon, Pt, item.tankInfo, item.tankAddress, TankID, sMap);
                else
                    mark = createMarkerWithClick(Icon, Pt, Info, TankID, sMap);

                mark.setMap(sMap);

                bounds.extend(Pt);
                sMap.fitBounds(bounds);

                Pt = null;
                sLat = "";
                sLng = "";
                sType = "";
                IsTab = false;
                Info = "";
                TankID = "";
                arrTabs = new Array();
                Icon = null;

            });

//            if (GlbPoliline != null)
//                DrawPolyLine(sMap)

        }
        

        if (bounds != null)
            sMap.fitBounds(bounds);
      

    }
    catch (e) { alert(e) }
}



//Icon Creation
function CreateIcon(sType, IsHistoryIcon)
{

	try
	{
		var icon;
		var sNewType = sType;		
		var point;
		
		var path = sWebPath + "images/" + sNewType;

		
		if( IsHistoryIcon || (sType == "Truck-New.gif" || sType == "Driver.gif") )
			point = new google.maps.Point(27, 20);
		else
			point = new google.maps.Point(6, 20);

		//path, marker size, marker origin, anchor
		var icon = new google.maps.MarkerImage(path,
      							new google.maps.Size(18,30),
      							new google.maps.Point(0,0), point
							);
							
		var shadow = new google.maps.MarkerImage(path,
      							new google.maps.Size(18,30),
      							new google.maps.Point(0,0), point
							);							
		return icon;
	}
	catch(e){}

}



//Marker Creation
function createMarkerWithClick(sIcon, point, Info, TankID,sMap) 
{
    try
	{
		 var marker = new google.maps.Marker({position: point,icon: sIcon});

        /*
            if(TankID != "")
			    Info += "<br><font color ='blue' >Click on Tank to view more...</font>"
            
			var infoWindow = new google.maps.InfoWindow();

			google.maps.event.addListener(marker, "mouseover", function() {
            infoWindow.setContent(Info);
   			infoWindow.open(sMap,marker);
            });
            
             if(TankID != "")
            {
                 google.maps.event.addListener(marker, "click", function() {
		         var mywin = window.open(sWebPath + "/TankInfo.aspx?TankID=" + TankID + "&IsFromMap=true",'mapWindow', 'width=1000,height=500,status=1,resizable=1,top=80,left=10,scrollbars=1');

                });
            } */

            return marker;
	}
	catch(e){}
}




//need to rewrite for tabbed window
//marker with  tabs
function createTabMarkerWithClick(sIcon, point, tankInfo, tankAddress, TankID, sMap) {
    try {
        
        var infoBubble;
        infoBubble = new InfoBubble({ maxWidth: 350, maxHeight: 300, minWidth: 300, minHeight: 150,
            borderWidth: 1, borderRadius: 0, borderColor: '#2c2c2c'
        });

        var tabs = [];

        if (tankInfo != null) {
            var sInfo = "<div class=\"tooltip\">";
            sInfo += "<B>Tank Name:</B> " +  tankInfo.TankName;
            sInfo += "<BR><B>Capacity:</B>" +  tankInfo.TankCapacity ;
            sInfo += "<BR><B>Current Quantity:</B> " +  tankInfo.CurrentQuantity ;
            sInfo += "<BR><B>ReOrder Level:</B>" +  tankInfo.ReOrderLevel ;
            sInfo += "<BR><B>Product:</B> " +  tankInfo.Product ;
            sInfo += "<br><font color ='blue' >Click on Tank to view more...</font></div>";
            infoBubble.addTab("Tank Info", sInfo);
        }

        if (tankAddress != null) {
            var sInfo = "<div class=\"tooltip\">";
            sInfo += "<B>Street: </B>" + tankAddress.Street ;
            sInfo += "<BR><B>City: </B>" + tankAddress.City ;
            sInfo += "<BR><B>State: </B> " + tankAddress.State ;
            sInfo += "<br><font color ='blue' >Click on Tank to view more...</font></div>";
            infoBubble.addTab("Address", sInfo);
        }

        var marker = null;

        if (sIcon != null)
            marker = new google.maps.Marker({ position: point, icon: sIcon, draggable: true });
        else
            marker = new google.maps.Marker({ position: point });


        google.maps.event.addListener(marker, "mouseover", function () {
            if (!infoBubble.isOpen()) {
                infoBubble.open(sMap, marker);
            }
        });

        if (TankID != "") {
            google.maps.event.addListener(marker, "click", function () {
//                var mywin = window.open(sWebPath + "/TankInfo.aspx?TankID=" + TankID + "&IsFromMap=true", 'Window', 'width=1000,height=500,status=1,resizable=1,top=80,left=10,scrollbars=1', false);

//                window.setTimeout(
//    				function () {
//    				    // mywin.moveTo(10,80); 
//    				    //  mywin.resizeTo(900, 600);
//    				    mywin.focus();
//    				},
                //   					 250);
                LoadTankDetails('#tankStatus', TankID);


            });
        }

        return marker;
    }
    catch (e) { }
}





//-----------------DISTANCE CALCULATION-------------------------//
var center;
var radius;
var geocoder;
var map;
var ChkPoint;
var cenpoint;
var TankData;

function FindMiles(returnData, miles) {

    var sLat, sLng, sTankID;

    TankData = returnData;

    var selectedTank = jQuery.grep(returnData, function (item, idx) {

        return (item.IsCurrentTank == true )

    });

    if (selectedTank != null && selectedTank.length > 0) {

        sLat = selectedTank[0].CurrentLatitude;
        sLng = selectedTank[0].CurrentLongitude;
        sTankID = selectedTank[0].TankID;
    }

    show(sLat, sLng, miles);
}

function show(Lat, Lng, miles) {

    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(Lat, Lng),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        overviewMapControl: true,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        }
    }

    map = new google.maps.Map(document.getElementById("tankmap"), mapOptions);
    cenpoint = new google.maps.LatLng(Lat, Lng);

    center = new google.maps.Marker(cenpoint, { draggable: false, title: "Center" });
    geocoder = new google.maps.Geocoder();
    radius = new google.maps.Marker(getRadius(miles, center), { draggable: false, title: "Radius" });

    CalculateCircle();
}


function CalculateCircle() {
    var points = [];
    var point = center;
    var lat = center.lat();
    var lng = center.lng();
    var Cradius = point.distanceFrom(radius) * 0.000621371192;
    var b = radius;
    var d2r = Math.PI / 180;
    var r2d = 180 / Math.PI;
    var Clat = (Cradius / 3963) * r2d;
    var Clng = Clat / Math.cos(lat * d2r);

    for (var i = 0; i < 13; i++) {
        var theta = Math.PI * (i / 6);
        Cx = parseFloat(lng) + parseFloat((Clng * Math.cos(theta)));
        Cy = parseFloat(lat) + parseFloat((Clat * Math.sin(theta)));
        points.push(new google.maps.LatLng(Cy, Cx));
    }

    var polygon = new google.maps.Polygon({
        paths: points,
        strokeColor: "#000000",
        strokeWeight: 5,
        strokeOpacity: 0.7,
        fillColor: "#aaaaff",
        fillOpacity: 0.5
    });

    polygon.setMap(map);


    google.maps.Polygon.prototype.Contains = function (point) {
        var j = 0;
        var oddNodes = false;
        var x = point.lng();
        var y = point.lat();

        for (var i = 0; i < this.getVertexCount(); i++) {
            j++;
            if (j == this.getVertexCount()) { j = 0; }
            if (((this.getVertex(i).lat() < y) && (this.getVertex(j).lat() >= y)) ||
            ((this.getVertex(j).lat() < y) && (this.getVertex(i).lat() >= y))) {
                if (this.getVertex(i).lng() + (y - this.getVertex(i).lat()) /
                (this.getVertex(j).lat() - this.getVertex(i).lat()) *
                (this.getVertex(j).lng() - this.getVertex(i).lng()) < x) {
                    oddNodes = !oddNodes
                }
            }
        }
        return oddNodes;
    }

    //google.maps.Polyline.prototype.Contains = google.maps.Polygon.prototype.Contains;

   

    $.each(TankData, function (i, item) {
        if (item.IsCurrentTank == false) {

            point = new google.maps.LatLng(item.CurrentLatitude, item.CurrentLongitude);

            if (polygon.Contains(point)) {

                if (sTankIDs != "")
                    sTankIDs = sTankIDs + ',';

                sTankIDs += item.TankID;
            
            }

        }
    });

   
}




function getRadius(miles, center) {
    var point = center.getPosition();
    var lat = center.lat();
    var lng = center.lng();
    var d2r = Math.PI / 180;
    var r2d = 180 / Math.PI;
    var Clat = (miles / 3963) * r2d;
    var Clng = Clat / Math.cos(lat * d2r);
    Clng = parseFloat(lng) + parseFloat((Clng * Math.cos(0)));
    Clat = parseFloat(lat) + parseFloat((Clat * Math.sin(0)));
    return (new google.maps.LatLng(Clat, Clng));
}

//---------------END OF DISTANCE CALCULATION --------------------------//



/***********************************************************************************
extented API.
/*
* Extended API for Google Maps v3
*
* by JosÃ© Fernando Calcerrada.
*
* Licensed under the GPL licenses:
* http://www.gnu.org/licenses/gpl.html
*
***********************************************************************************/

// LatLng
/******************************************************************************/
google.maps.LatLng.prototype.distanceFrom = function (latlng) {
    var lat = [this.lat(), latlng.lat()]
    var lng = [this.lng(), latlng.lng()]

    //var R = 6371; // km (change this constant to get miles)
    var R = 6378137; // In meters
    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
    var dLng = (lng[1] - lng[0]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) *
  Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return Math.round(d);
}
// TODO: revisar para 179, -179
google.maps.LatLng.prototype.getMiddle = function (latlng) {
    var lat = (this.lat() + latlng.lat()) / 2;
    var lng = this.lng() - latlng.lng();      // Distance between

    // To control the problem with +-180 degrees.
    if (lng <= 180 && lng >= -180) {
        lng = (this.lng() + latlng.lng()) / 2;
    } else {
        lng = (this.lng() + latlng.lng() + 360) / 2;
    }

    return new google.maps.LatLng(lat, lng)
}


google.maps.LatLng.prototype.latRadians = function () {
    return (Math.PI * this.lat()) / 180;
}

google.maps.LatLng.prototype.lngRadians = function () {
    return (Math.PI * this.lng()) / 180;
}


// Marker
/******************************************************************************/
google.maps.Marker.prototype.distanceFrom = function (marker) {
    return this.getPosition().distanceFrom(marker.getPosition());
}

google.maps.Marker.prototype.getMiddle = function (marker) {
    return this.getPosition().getMiddle(marker.getPosition());
}


// Polyline
/******************************************************************************/
google.maps.Polyline.prototype.deleteVertex = function (i) {
    this.getPath().removeAt(i);
}

google.maps.Polyline.prototype.getBounds = function () {
    var latlngBounds = new google.maps.LatLngBounds();
    var path = this.getPath();

    for (var i = 0; i < path.getLength(); i++) {
        latlngBounds.extend(path.getAt(i));
    }

    return latlngBounds;
}

google.maps.Polyline.prototype.getLength = function () {
    var d = 0;
    var path = this.getPath();
    var latlng;

    for (var i = 0; i < path.getLength() - 1; i++) {
        latlng = [path.getAt(i), path.getAt(i + 1)]
        d += latlng[0].distanceFrom(latlng[1]);
    }

    return d;
}

google.maps.Polyline.prototype.getVertex = function (i) {
    return this.getPath().getAt(i);
}

google.maps.Polyline.prototype.getVertexCount = function () {
    return this.getPath().getLength();
}

google.maps.Polyline.prototype.getVisible = function () {
    return (this.getMap()) ? true : false;
}

google.maps.Polyline.prototype.insertVertex = function (i, latlng) {
    this.getPath().insertAt(i, latlng);
}

google.maps.Polyline.prototype.lastMap = null;

google.maps.Polyline.prototype.setVertex = function (i, latlng) {
    this.getPath().setAt(i, latlng);
}

google.maps.Polyline.prototype.setVisible = function (visible) {
    if (visible === true && !this.getVisible()) {
      //  this.setMap(this.lastMap);

    } else if (visible === false && this.getVisible()) {
        this.lastMap = this.getMap();
        this.setMap(null);
    }
}



// Polygon
/******************************************************************************/
google.maps.Polygon.prototype.deleteVertex = function (i) {
    this.getPath().removeAt(i);
}

google.maps.Polygon.prototype.getBounds = function () {
    var latlngBounds = new google.maps.LatLngBounds();
    var path = this.getPath();

    for (var i = 0; i < path.getLength(); i++) {
        latlngBounds.extend(path.getAt(i));
    }

    return latlngBounds;
}

google.maps.Polygon.prototype.getPerimeter = function () {
    var d = 0;
    var path = this.getPath();
    var latlng, first;

    if (path.getLength()) {
        first = path.getAt(1);
    }

    for (var i = 0; i < path.getLength(); i++) {
        if (i < path.getLength() - 1) {
            latlng = [path.getAt(i), path.getAt(i + 1)];
        } else {
            if (first == path.getAt[i]) {
                break;
            } else {
                latlng = [path.getAt(i), path.getAt(0)];
            }
        }
        d += latlng[0].distanceFrom(latlng[1]);
    }

    return d;
}

google.maps.Polygon.prototype.getVertex = function (i) {
    return this.getPath().getAt(i);
}

google.maps.Polygon.prototype.getVertexCount = function () {
    var path = this.getPath();
    var length = path.getLength();
    if (!path.getAt(0).equals(path.getAt(length - 1))) {
        return length;
    } else {
        return length - 1;
    }
}

google.maps.Polygon.prototype.getVisible = function () {
    return (this.getMap()) ? true : false;
}

google.maps.Polygon.prototype.insertVertex = function (i, latlng) {
    this.getPath().insertAt(i, latlng);
}

google.maps.Polygon.prototype.lastMap = null;

google.maps.Polygon.prototype.setVertex = function (i, latlng) {
    this.getPath().setAt(i, latlng);
}

google.maps.Polygon.prototype.setVisible = function (visible) {
    if (visible === true && !this.getVisible()) {
        this.setMap(this.lastMap);

    } else if (visible === false && this.getVisible()) {
        this.lastMap = this.getMap();
        this.setMap(null);
    }
}

