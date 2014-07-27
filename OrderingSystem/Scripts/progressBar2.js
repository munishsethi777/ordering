var box2;

/*
* Ajax overlay 1.0
* Author: Simon Ilett @ aplusdesign.com.au
* Descrip: Creates and inserts an ajax loader for ajax calls / timed events 
* Date: 03/08/2011 
*/
function ajaxLoader(el, options) {
    // Becomes this.options
    var defaults = {
        bgColor: '#fff',
        duration: 8,
        opacity: 0.7,
        classOveride: false
    }
    this.options = jQuery.extend(defaults, options);
    this.container = $('#bodySectionProgress'); // main div's id

    this.init = function () {
        var container = this.container;
        // Delete any other loaders
        this.remove();
        // Create the overlay 
        var overlay = $('<div><a onclick="CloseLoading();" class="icon-remove" title="Cancel Progressing..." style="float:right;"></a></div>').css({
            'background-color': this.options.bgColor,
            'opacity': this.options.opacity,
            'width': '99%', // container.width(),
            'height': '100%', //container.height(),
            'position': 'absolute',
            //'top': '0px',
            'bottom':'0px',
            'left': '0px',
            'z-index': 99999
        }).addClass('ajax_overlay');
        // add an overiding class name to set new loader style 
        if (this.options.classOveride) {
            overlay.addClass(this.options.classOveride);
        }
        // insert overlay and loader into DOM 
//        container.append(
//			overlay.append('<div class="progress progress-striped active"><div class="bar " style="width: 100%"></div></div>')
//                //$('<div></div>').addClass('ajax_loader').append('<div class="progress progress-striped active"><div class="bar " style="width: 100%"></div></div>')
//                //$('<div class="progress progress-striped active">').append('<div class="bar" style="width: 100%"></div>')
//			.fadeIn(this.options.duration)
        //		);
        container.append(
			overlay.append(
				$('<div></div>').addClass('ajax_loader')
			).fadeIn(this.options.duration)
		);
    };

    this.remove = function () {
        var overlay = this.container.children(".ajax_overlay");
        if (overlay.length) {
            overlay.fadeOut(this.options.classOveride, function () {
                overlay.remove();
            });
        }
    }

    this.init();
}
function CloseLoading() {
    if (box2) box2.remove();
}