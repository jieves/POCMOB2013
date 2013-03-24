// Hier defaults van JQuery Mobile overrulen


$(document).bind("mobileinit", function(){
 
     // Page
    $.mobile.page.prototype.options.headerTheme  = "b";  // Page header only
    $.mobile.page.prototype.options.contentTheme = "b";
    $.mobile.page.prototype.options.footerTheme  = "b";
	
    // Listviews
    $.mobile.listview.prototype.options.headerTheme  = "a";  // Header for nested lists
    $.mobile.listview.prototype.options.theme        = "c";  // List items / content
    $.mobile.listview.prototype.options.dividerTheme = "c";  // List divider	
	
	
	$.mobile.defaultPageTransition = 'slide';
	
	$.mobile.listview.prototype.options.filterPlaceholder = "Zoeken naar ...";
	
    $.mobile.loader.prototype.options.text = "bezig met laden ...";
    $.mobile.loader.prototype.options.textVisible = true;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";	
	
//	$.mobile.ajaxEnabled = false; 
});
	
$(document).delegate('#article_list', 'pageinit', function() {

	var db = openDatabase("axipocmob", "1.0", "AXI POC Mobile", 2 * 1024 * 1024);
	db.transaction(function(tx){
		  tx.executeSql('SELECT * FROM artikelen', [], queryArtikelenSuccess, queryError);
	});

	
});
	
//Deze code moet geplaatst worden in de eerste pagina waarvan de andere via Ajax opgeroepen worden
$(document).delegate('#article_detail', 'pageinit', function() {
	$(function(){
		var mySwiper = $('.swiper-container').swiper({ 
		  speed:750, 
		  pagination : '.pagination-free',
		  mode:'horizontal'});
	});	

}); 

$(document).delegate('#detail_bezoek', 'pageinit', function() {		

      state = $("#toggle_bezoekok").val();
	  if (state.toString() == "ok") {
		 $('div#bewaar_verslag input[type=button]').button('enable'); 
	  } else {
   	     $('div#bewaar_verslag input[type=button]').button('disable');
	  };

	$('select#toggle_bezoekok').change(function() {
      state = $("#toggle_bezoekok").val();
	  if (state.toString() == "ok") {
		 $('div#bewaar_verslag input[type=button]').button('enable'); 
	  } else {
   	     $('div#bewaar_verslag input[type=button]').button('disable');
	  };
    });
	
    $("#butt_bewaar_verslag").bind( "click", function(event, ui) {
       $.mobile.loading( 'show', { text: "Verslag wordt bewaard", textonly: false });
	   setTimeout( function() { $.mobile.hidePageLoadingMsg(); $.mobile.changePage( "overzicht_bezoeken.html", { transition: "fade"} ); },1000 );
    });	

	
});
	

	

function showHideDiv(v_div) { 
   var divstyle = new String(); 
   divstyle = document.getElementById(v_div).style.visibility; 
   
   if (divstyle.toLowerCase() == "visible" || divstyle == "") { 
  	 document.getElementById(v_div).style.visibility = "hidden"; 
	 document.getElementById(v_div).style.height = "0px"; 
   } 
   else { document.getElementById(v_div).style.visibility = "visible"; 
      	  document.getElementById(v_div).style.height = ""; 
  	    };
};

$(document).delegate('#kies_leverancier', 'pageinit', function() {		

	$("li.externallink").each(function(index) {
		
		var url_link = $(this).find("a.url_link").attr("href");
		var phone_link = $(this).find("a.phone_link").attr("href");
		
		$(this).live('swiperight', function(event) {
			window.open(url_link, '_blank');
    	});
			  
		$(this).live('swipeleft', function(event) {
		   var div_extra_info = $(this).find('div[id*="image_list_info"]:first').attr("id");
		   showHideDiv(div_extra_info);
	    });
		
   }); // each
 });

$(document).delegate('#synchronise', 'pageinit', function() {

	var db = window.openDatabase("axipocmob", "1.0", "AXI POC Mobile", 2 * 1024 * 1024);
	db.transaction(createDB, errorCreateDB, successCreateDB);

	$(document).on("click", ".download_artikelen", function() {

		$.mobile.loading( 'show', { text: "Bezig met synchroniseren", textonly: false });
		$('#synchro').html('Synchroniseren . . .');

		$.getJSON('http://wlu1114be.axi.intra:9003/POCMOB/jersey/artikel/all',
			function (data) {
				console.log('success function');
				// console.log(data);
				$('#result').html(data.length+' artikelen gevonden.');
				var db = openDatabase("axipocmob", "1.0", "AXI POC Mobile", 2 * 1024 * 1024);
				db.transaction(function (tx) {
					  deleteArtikelen(tx);
					  for (var i = 0; i < data.length; i++) {
						  tx.executeSql('INSERT INTO artikelen (deartnr, deartom, deakppr) VALUES ( ? , ? , ? )',
								  [data[i].deartnr, data[i].deartom, data[i].deakppr] );
						  console.log ('Inserted ' + data[i].deartnr);
					  }
				});
			})
			.error(function(args) { 
				console.log('error function');
				//$('#synchro').html('Fout opgetreden tijdens oproep naar RESTful web service :(');
				$('#synchro').html(args);
			})
			.complete(function() {
				console.log('Download afgewerkt');
			});

		$.mobile.hidePageLoadingMsg();

    });

});
 
function createDB(tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS artikelen (deartnr unique, deartom, deakppr)');
}

function errorCreateDB(err) {
	alert("Error processing SQL: "+err.code);
}

function successCreateDB() {
	console.log("Created a database!");
}

function deleteArtikelen(tx) {
	tx.executeSql('DELETE FROM artikelen');
}
function queryArtikelenSuccess(tx, results) {

	var len = results.rows.length, i;
	for (i = 0; i < len; i++) {
	    console.log(results.rows.item(i).deartnr + ' : ' + results.rows.item(i).deartom);
	    appendArtikel(results.rows.item(i));
	}
	
	  $('#artikelen').listview('refresh');
	//$('ul.artikelen').listview('refresh');
	
	
}

function appendArtikel(artikel){		
    $('#artikelen').append('<li class="artikel"><a href="artikel.html?deartnr=' + artikel.deartnr + '"> <img class="myListLogo" src="./img/nikon_coolpix-l25-white_8880867_1.jpg"> <h1 class="myHeader">' +  artikel.deartom + '</h1><p class="myParagraph">'+artikel.deakppr+'</p></a></li>');
}

function queryError(err) {
	console.log("Fout bij ophalen gegevens: " + err.code);
}


			
			var mobileDemo = { 'center': '50.82293754987534, 3.263620000000003', 'zoom': 10 };
			

			
			$('#directions_map').live('pageinit', function() {
				demo.add('directions_map', function() {
					$('#map_canvas_1').gmap({'center': mobileDemo.center, 'zoom': mobileDemo.zoom, 'disableDefaultUI':true, 'callback': function() {
						var self = this;
						self.set('getCurrentPosition', function() {
							self.refresh();
							self.getCurrentPosition( function(position, status) {
								if ( status === 'OK' ) {
									var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
									self.get('map').panTo(latlng);
									self.search({ 'location': latlng }, function(results, status) {
										if ( status === 'OK' ) {
											$('#from').val(results[0].formatted_address);
										}
									});
								} else {
									//alert('Unable to get current position');
								}
							});
						});
						$('#submit').click(function() {
							self.displayDirections({ 'origin': $('#from').val(), 'destination': $('#to').val(), 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('directions')}, function(response, status) {
								( status === 'OK' ) ? $('#results').show() : $('#results').hide();
							});
							return false;
						});
					}});
				}).load('directions_map');
			});
			
			$('#directions_map').live('pageshow', function() {
				demo.add('directions_map', $('#map_canvas_1').gmap('get', 'getCurrentPosition')).load('directions_map');
			});
			

				

