/*
Theme Name: Landberg
Description: Creative Coming Soon Template
Author: Erilisdesign
Theme URI: https://preview.erilisdesign.com/html/landberg/
Author URI: https://themeforest.net/user/erilisdesign
Version: 1.1.0
License: https://themeforest.net/licenses/standard
*/

/*------------------------------------------------------
[Table of contents]

1. Loader
2. Flyer
3. Navigation
4. Back to top
5. Layout resize
6. Backgrounds
7. Lightbox
8. Countdown
9. Mailchimp
10. Contact Form
11. Bootstrap
------------------------------------------------------*/

(function($){
  "use strict";

  // Vars
  var $html = $('html'),
    $body = $('body'),
    $flyer = $('.flyer'),
    $flyerBackdrop = $('.flyer-backdrop'),
    $flyerInner = $('.flyer-inner'),
    flyerInnerOffset = $flyerInner ? parseInt( $flyerInner.css('padding-top'), 10 ) : 0,
    flyerRun = false,
    closeFlyerOnClickOutside = true,
    $siteNavbar = $('.site-navbar'),
    $siteNavbarCollapse = $('.site-navbar #navbarCollapse'),
    $siteNavbarToggler = $('.site-navbar .navbar-toggler-alternative'),
    siteNavbar_base = $siteNavbar.attr('data-navbar-base') ? $siteNavbar.attr('data-navbar-base') : '',
    siteNavbar_flyer = $siteNavbar.attr('data-navbar-flyer') ? $siteNavbar.attr('data-navbar-flyer') : '',
    siteNavbar_toggled = $siteNavbar.attr('data-navbar-toggled') ? $siteNavbar.attr('data-navbar-toggled') : '',
    siteNavbar_scrolled = $siteNavbar.attr('data-navbar-scrolled') ? $siteNavbar.attr('data-navbar-scrolled') : '',
    $btn_backToTop = $('.btn-back-to-top'),
    $btn_closeFlyer = $('.btn-close-flyer');

  // Analyze Devices and Browsers
  window.isMobile = false;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { window.isMobile = true; }

  //Detect Browser
  window.isMSIE = navigator.userAgent.match('MSIE');
  window.isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream !== null;

  function getWindowWidth(){
    return Math.max($(window).width(), window.innerWidth);
  }

  function getWindowHeight(){
    return Math.max($(window).height(), window.innerHeight);
  }

  function getBodyWidth(){
    return Math.max($('body').width(), document.querySelector('body').offsetWidth);
  }

  function getScrollbarWidth(){
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  // [1. Loader]
  window.addEventListener( 'load', function(){
    document.querySelector('body').classList.add('loaded');
  });

  // [2. Flyer]
  function resetScrollbar(){
    $html.css('overflow-y','');
    $body.css('overflow-y','');
  }

  function hideScrollbar(){
    $html.css('overflow-y','hidden');
    $body.css('overflow-y','hidden');
  }

  function setScrollbar(){
    if( $flyer.length > 0 && getWindowWidth() >= 1200 ){
      var bodyHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

      if( getWindowHeight() === bodyHeight ){
        $html.css('overflow-y','scroll');
        $body.css('overflow-y','hidden');
      }
    }
  }

  function showFlyer(){
    if( $flyer.length > 0 ){
      $body.css('padding-right',getScrollbarWidth());
      $flyerBackdrop.css('display','block');
      $flyer.css('display','block');
      $btn_closeFlyer.css('right',getScrollbarWidth());
      $btn_backToTop.css('right',getScrollbarWidth());

      setTimeout( function(){
        if ( !$body.hasClass('flyer-animated') ){
          $body.addClass('flyer-animated');
        }

        if ( !$body.hasClass('flyer-open') ){
          $body.addClass('flyer-open');
        }

        landberg_navChangeClasses('flyer');
        $flyerBackdrop.addClass('show');
        $flyer.addClass('show');
        $btn_closeFlyer.addClass('show');
      }, 20);
    }
  }

  function hideFlyer(){
    if( $flyer.length > 0 ){
      $body.removeClass('flyer-animated');
      $btn_closeFlyer.removeClass('show');
      $flyer.removeClass('show');
      $flyerBackdrop.removeClass('show');
      landberg_navOnScroll();
      landberg_backToTop();
      landberg_navChangeClasses();

      document.querySelector('.flyer').addEventListener('transitionend', function(e){
        this.style.display = '';

        resetScrollbar();
        setScrollbar();
        $body.css('padding-right','');
        $btn_closeFlyer.css('right','');
        $btn_backToTop.css('right','');
      }, {
        capture: false,
        once: true,
        passive: false
      });
    }
  }

  // [3. Navigation]
  function landberg_navigation(){

    // Navigation collapse
    $siteNavbarCollapse.on( 'show.bs.collapse', function(){
      $siteNavbar.addClass('navbar-toggled-show');
      $siteNavbarToggler.blur();
      landberg_navChangeClasses('toggled');
    });

    $siteNavbarCollapse.on( 'hidden.bs.collapse', function(){
      $siteNavbar.removeClass('navbar-toggled-show');
      $siteNavbarToggler.blur();

      if ( $siteNavbar.hasClass('scrolled') ){
        landberg_navChangeClasses('scrolled');
      } else {
        landberg_navChangeClasses();
      }
    });

    // Close Flyer on click outside of the content
    if( closeFlyerOnClickOutside ){
      $(document).on( 'click', '.flyer', function(e){
        if( flyerRun === true ){
          return;
        }

        if( !$(e.target).hasClass('flyer-inner') ){
          return;
        }

        if ( $body.hasClass('flyer-open') ){
          $btn_closeFlyer.trigger('click');
        }
      });
    }

    // Clickable Links
    $(document).on( 'click', 'a.scrollto, .site-navbar a[href^="#"], a.btn-cloase-flyer', function(e){
      var target;

      // Make sure this.hash has a value before overriding default behavior
      if ( this.hash !== '' && this.hash !== '#!' && $( this.hash ).length > 0 ){
        target = this.hash;
      } else {
        return false;
      }

      if( target !== '' ){
        // Prevent default anchor click behavior
        e.preventDefault();

        if( $flyer.length > 0 && getWindowWidth() >= 1200 ){
          if( $flyer.find(target).length > 0 ){
            if( flyerRun === true ){
              return false;
            }

            flyerRun = true;

            if ( !$body.hasClass('flyer-animated flyer-open') ){
              resetScrollbar();
              hideScrollbar();

              showFlyer();
            }

            var targetPosition = document.querySelector(target).offsetTop;
            if( targetPosition > 0 ){
              targetPosition = targetPosition + flyerInnerOffset;
            }

            if ( !$body.hasClass('flyer-open') ){
              document.querySelector('.flyer').addEventListener('transitionend', function(e){
                smoothScroll(targetPosition);

                flyerRun = false;
              }, {
                capture: false,
                once: true,
                passive: false
              });
            } else {
              smoothScroll(targetPosition);

              flyerRun = false;
            }
          } else {
            if( flyerRun === true ){
              return false;
            }

            flyerRun = true;

            if ( $body.hasClass('flyer-animated flyer-open') ){
              hideFlyer();

              document.querySelector('.flyer-backdrop').addEventListener('transitionend', function(e){
                this.style.display = '';
                if ( $body.hasClass('flyer-open') ){
                  $body.removeClass('flyer-open');
                }

                $flyer.stop().scrollTop(0);
                flyerRun = false;
                landberg_navOnScroll();
                landberg_backToTop();
              }, {
                capture: false,
                once: true,
                passive: false
              });
            } else {
              var targetPosition = parseInt( Math.max( document.querySelector(target).offsetTop, $(target).offset().top ), 10 );

              smoothScroll(targetPosition);

              flyerRun = false;
            }
          }

          $(this).blur();
        } else {
          var targetPosition = parseInt( Math.max( document.querySelector(target).offsetTop, $(target).offset().top ), 10 );

          smoothScroll(targetPosition);
          $(this).blur();
        }
      }

      return false;
    });

    // Back to top
    $(document).on( 'click', '.btn-back-to-top', function(e){
      e.preventDefault();

      smoothScroll(0);

      $(this).blur();
    });

    // Close nav on click outside of '.sitenav-collapse-inner'
    $(document).on( 'click touchstart', function(e){
      if ( $siteNavbar.is(e.target) || $(e.target).closest('.site-navbar').hasClass('site-navbar') || $(e.target).hasClass('navbar-toggler') || $(e.target).hasClass('navbar-toggler-alternative') ){
        return;
      }

      if ( $siteNavbarToggler.attr('aria-expanded') === 'true' ){
        $siteNavbarToggler.trigger('click');
      }
    });

  }

  function smoothScroll(targetPosition){
    if( $body.hasClass('flyer-open') ){
      $flyerInner.scrollTo(targetPosition,800);
    } else {
      $(window).scrollTo(targetPosition,800);
    }
  }

  function landberg_navOnScroll(){
    if ( $siteNavbar.length > 0 ){
      var currentPos = $(window).scrollTop();
      if( $body.hasClass('flyer-animated') ){
        currentPos = $flyerInner.scrollTop();
      }

      if ( currentPos > 0 ){
        if ( $siteNavbar.hasClass('scrolled') ){
          return;
        }

        $siteNavbar.addClass('scrolled').removeClass('scrolled-0');

        if( $siteNavbar.hasClass('navbar-toggled-show') ){
          landberg_navChangeClasses('toggled');
        } else {
          landberg_navChangeClasses('scrolled');
        }
      } else {
        $siteNavbar.removeClass('scrolled').addClass('scrolled-0');

        if( $siteNavbar.hasClass('navbar-toggled-show') ){
          landberg_navChangeClasses('toggled');
        } else if( $body.hasClass('flyer-open') ){
          landberg_navChangeClasses('flyer');
        } else {
          landberg_navChangeClasses();
        }
      }
    }
  }

  var nav_event_old;
  function landberg_navChangeClasses(nav_event){
    if( nav_event_old === nav_event && !( nav_event == '' || nav_event == undefined ) )
      return;

    if( nav_event === 'toggled' && siteNavbar_toggled ){
      $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_flyer, siteNavbar_scrolled);
      $siteNavbar.addClass(siteNavbar_toggled);
    } else if( nav_event === 'scrolled' && siteNavbar_scrolled ){
      $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_flyer, siteNavbar_toggled);
      $siteNavbar.addClass(siteNavbar_scrolled);
    } else if( nav_event === 'flyer' ){
      if( $siteNavbar.hasClass('scrolled') && siteNavbar_scrolled ){
        $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_flyer, siteNavbar_toggled);
        $siteNavbar.addClass(siteNavbar_scrolled);
      } else {
        if( siteNavbar_flyer ){
          $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_base, siteNavbar_toggled, siteNavbar_scrolled);
          $siteNavbar.addClass(siteNavbar_flyer);
        }
      }
    } else {
      if(siteNavbar_base){
        $siteNavbar.removeClass('navbar-light navbar-dark', siteNavbar_toggled, siteNavbar_scrolled, siteNavbar_flyer);
        $siteNavbar.addClass(siteNavbar_base);
      }
    }

    if( $siteNavbar.hasClass('navbar-light') ){
      $('[data-on-navbar-light]').each(function(){
        var el = $(this);

        if( el.attr('data-on-navbar-dark') ){
          el.removeClass(el.attr('data-on-navbar-dark'));
        }
        if( el.attr('data-on-navbar-light') ){
          el.addClass(el.attr('data-on-navbar-light'));
        }
      });
    } else if( $siteNavbar.hasClass('navbar-dark') ){
      $('[data-on-navbar-dark]').each(function(){
        var el = $(this);

        if( el.attr('data-on-navbar-light') ){
          el.removeClass(el.attr('data-on-navbar-light'));
        }
        if( el.attr('data-on-navbar-dark') ){
          el.addClass(el.attr('data-on-navbar-dark'));
        }
      });
    }

    nav_event_old = nav_event;
  }

  // [4. Back to top]
  function landberg_backToTop(){
    if( $btn_backToTop.length > 0 ){
      var currentPos = $(window).scrollTop();
      if( $body.hasClass('flyer-animated') ){
        currentPos = $flyerInner.scrollTop();
      }

      if( currentPos > 400 ){
        $btn_backToTop.addClass('show');
      } else {
        $btn_backToTop.removeClass('show');
      }
    }
  }

  // [5. Layout Resize]
  function landberg_layoutResize(){
    if( $flyerBackdrop.length > 0 ){
      $flyerBackdrop.css('width',getBodyWidth());
    }

    if( getWindowWidth() >= 1200 && $flyer.length > 0 ){
      var siteNavbarHeight = parseInt( Math.max( $siteNavbar.innerHeight(), $siteNavbar.height() ), 10 );

      if ( $siteNavbarToggler.attr('aria-expanded') === 'true' ){
        $siteNavbar.removeClass('navbar-toggled-show');
        $siteNavbarCollapse.removeClass('show');
        $siteNavbarToggler.attr('aria-expanded','false');
        $siteNavbarToggler.addClass('collapsed');
        landberg_navChangeClasses();
      }

      $siteNavbar.css('width',getBodyWidth());
      $btn_closeFlyer.css('top',siteNavbarHeight);
    } else {
      if( $flyer.length > 0 ){
        resetScrollbar();
        $body.css('padding-right','');
        $flyer.css('display','');
        $flyer.removeClass('show');
        $flyerBackdrop.css('display','');
        $flyerBackdrop.removeClass('show');
        $btn_closeFlyer.css('top','');
        $btn_closeFlyer.css('right','');
        $btn_closeFlyer.removeClass('show');
        $btn_backToTop.css('right','');
        $body.removeClass('flyer-open flyer-animated');

        flyerRun = false;
      }

      $siteNavbar.css('width','');
    }
  }

  // [6. Backgrounds]
  function landberg_backgrounds(){

    // Image
    var $bgImage = $('.bg-image-holder');
    if($bgImage.length){
      $bgImage.each(function(){
        var $self = $(this);
        var src = $self.children('img').attr('src');

        $self.css('background-image','url('+src+')').children('img').hide();
      });
    }

    // Video Background
    if ( $body.hasClass('mobile') ){
      $('.video-wrapper').css('display','none');
    }

  }

  // [7. Lightbox]
  function landberg_lightbox(){
    if(!$().featherlight){
      console.log('Featherlight: featherlight not defined.');
      return true;
    }

    $.extend($.featherlight.defaults, {
      closeIcon: '<i class="fas fa-times"></i>'
    });

    $.extend($.featherlightGallery.defaults, {
      previousIcon: '<i class="fas fa-chevron-left"></i>',
      nextIcon: '<i class="fas fa-chevron-right"></i>'
    });

    $.featherlight.prototype.afterOpen = function(){
      $body.addClass('featherlight-open');
    };

    $.featherlight.prototype.afterContent = function(){
      var title = this.$currentTarget.attr('data-title');
      var text = this.$currentTarget.attr('data-text');

      if( !title && !text )
        return;

      this.$instance.find('.caption').remove();

      var title = title ? '<h4 class="title-gallery">' + title + '</h4>' : '',
        text = text ? '<p class="text-gallery">' + text + '</p>' : '';

      $('<div class="caption">').html( title + text ).appendTo(this.$instance.find('.featherlight-content'));
    };

    $.featherlight.prototype.afterClose = function(){
      $body.removeClass('featherlight-open');
    };
  }

  // [8. Countdown]
  function landberg_countdown(){
    var countdown = $('.countdown[data-countdown]');

    if (countdown.length > 0){
      countdown.each(function(){
        var $countdown = $(this),
          finalDate = $countdown.data('countdown');
        $countdown.countdown(finalDate, function(event){
          $countdown.html(event.strftime(
            '<div class="countdown-container row"> <div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%-D</div><span class="title">Day%!d</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%H</div><span class="title">Hours</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%M</div><span class="title">Minutes</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%S</div><span class="title">Seconds</span></div></div></div>'
          ));
        });
      });
    }
  }

  // [9. Subscribe Form]
  function landberg_subscribeForm(){
    var $subscribeForm = $('.subscribe-form');

    if ( $subscribeForm.length > 0 ){
      $subscribeForm.each( function(){
        var el = $(this),
          elResult = el.find('.subscribe-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              resetForm: true,
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [10. Contact Form]
  function landberg_contactForm(){
    var $contactForm = $('.contact-form');

    if ( $contactForm.length > 0 ){
      $contactForm.each( function(){
        var el = $(this),
          elResult = el.find('.contact-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [11. Bootstrap]
  function landberg_bootstrap(){

    // Botostrap Tootltips
    $('[data-toggle="tooltip"]').tooltip();

    // Bootstrap Popovers
    $('[data-toggle="popover"]').popover();

    // Modals
    $('.modal').on('show.bs.modal', function(e){
      if( $flyer.length > 0 ){
        resetScrollbar();
        hideScrollbar();
        $body.css('padding-right',getScrollbarWidth());
      }
    });

    $('.modal').on('hidden.bs.modal', function(e){
      if( $flyer.length > 0 ){
        resetScrollbar();

        if( $body.hasClass('flyer-open') ){
          hideScrollbar();
          $body.css('padding-right',getScrollbarWidth());
        } else {
          setScrollbar();
        }
      }
    });

  }

  $(document).ready(function($){
    resetScrollbar();
    setScrollbar();

    landberg_navigation();
    landberg_navOnScroll();
    landberg_backToTop();
    landberg_layoutResize();
    landberg_backgrounds();
    landberg_lightbox();
    landberg_countdown();
    landberg_subscribeForm();
    landberg_contactForm();
    landberg_bootstrap();
  });

  $(window).on( 'resize', function(){
    resetScrollbar();
    setScrollbar();

    landberg_navOnScroll();
    landberg_backToTop();
    setTimeout(function(){
      landberg_layoutResize();
    }, 50);
  });

  $(window).on( 'scroll', function(){
    landberg_navOnScroll();
    landberg_backToTop();
  });

  $flyerInner.on( 'scroll', function(){
    landberg_navOnScroll();
    landberg_backToTop();
  });

})(jQuery);