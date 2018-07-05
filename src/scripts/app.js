//Срелка скрола к нужному блоку

var Arrow = (function() {

    return {
        init: function() {
            const Height = $('.js-section-two').offset().top;

            $('.c-arrow').on('click', function() {
                $('body,html').animate({
                    scrollTop: Height
                }, 1000);
                return false;
            });
        }
    }
}());

//Гамбургер-меню
var Hamburger = (function() {
    var
        hamburger = $('.js-hamburger'),
        navContainer = $('.js-navigation'),
        navContent = $('.c-navigation');

    return {
        init: function() {
            hamburger.on('click', function(e) {
                e.preventDefault();

                var _this = $(this);

                _this.toggleClass('active');
                $('body').toggleClass('active');
                setTimeout(function() {
                    navContent.toggleClass('active');
                }, 500);
                navContainer.toggleClass('active')
            });
        }
    }
}());

$(function() {
    if ($('#hamburger').length) {
        Hamburger.init();
    }
    if ($('#arrow').length) {
        Arrow.init();
    }
});
//Авторизация на главной странице
var AuthorizationButton = (function() {
    var
        authorization = $('.js-authorization'),
        cardFlip = $('.l-card__wrapper');

    return {
        init: function() {
            authorization.on('click', function(e) {
                e.preventDefault();

                $('#authorizationButton').toggleClass('active');
                setTimeout(function() {
                    cardFlip.toggleClass('flip');
                }, 100);
            });
        }
    }
}());

var AuthorizationSubmit = (function() {
    return {
        init: function() {
            $("#authorization").submit(function(event) {
                event.preventDefault();

                if (!($("#noRobot").prop("checked") && $('input[name=radio]:checked', '#authorization').val() == 1)) {
                    $("#validation1").text('Роботы нам не нужны');
                } else {
                    $("#validation1").text('Замечательно! Сабмит реализую позже');
                }
            });
        }
    }
}());

$(function() {
    if ($('#authorizationButton').length) {
        AuthorizationButton.init();
    }
    if ($('#authorization').length) {
        AuthorizationSubmit.init();
    }
});

//прелоадер для всех страниц
var preloader = (function() {
    var
        preloader = $('.preloader'),
        persentsTotal = 0,
        cardAnimate = $('.l-card__wrapper');
    var imgPath = $('*').map(function(ind, element) {

        var
            background = $(element).css('background-image'),
            path = '';
        var isImg = $(element).is('img');

        if (background != 'none') {
            path = background.replace('url("', '').replace('")', '')
        }

        if (isImg) {
            path = $(element).attr('src')
        }

        if (path) return path;
    });

    var setPersents = function(total, current) {

        var persents = Math.ceil(current / total * 100);
        $('.js-percents').text(persents + '%');

        if (persents >= 100) {
            preloader.fadeOut();
            cardAnimate.addClass('active');
        }
    };

    var loadImages = function(images) {
        if (!images.length) preloader.fadeOut();

        images.forEach(function(img, i, images) {
            var fakeImages = $('<img>', {
                attr: {
                    src: img
                }
            });

            fakeImages.on('load error', function() {
                persentsTotal++;
                setPersents(images.length, persentsTotal);
            })
        });

    };

    return {
        init: function() {
            var imgs = imgPath.toArray();
            loadImages(imgs);
        }
    }
}());

$(function() {
    preloader.init();
});
//Анимация для букв слайдера на странице "портфолио"

if ($('#slider').length) {
    var aviatitle = {
        generate: function(string, block) {
            var wordsArray = string.split(' '),
                stringArray = string.split(''),
                sentence = [],
                word = '';

            block.text('');

            wordsArray.forEach(function(currentWord) {
                var wordsArray = currentWord.split('');

                wordsArray.forEach(function(letter) {
                    var letterHtml = '<span class="letter-span">' + letter + '</span>';

                    word += letterHtml;
                });

                var wordHTML = '<span class="letter-word">' + word + '</span>';

                sentence.push(wordHTML);
                word = '';
            });

            block.append(sentence.join(' '));

            // анимация появления
            var letters = block.find('.letter-span'),
                counter = 0,
                timer,
                duration = 500 / stringArray.length;

            function showLetters() {
                var currentLetter = letters.eq(counter);

                currentLetter.addClass('active');
                counter++;

                if (typeof timer !== 'undefined') {
                    clearTimeout(timer);
                }

                timer = setTimeout(showLetters, duration);
            }

            showLetters();

        }
    };
}

//Слайдер на странице "портфолио"

var sliderCont = (function() {
    var Slider = function(container) {
        var nextBtn = container.find('.js-slider-bth--left'),
            prevBtn = container.find('.js-slider-bth--right'),
            items = nextBtn.find('.js-slider-item'),
            display = container.find('.js-slider-display'),
            title = container.find('.js-slider-subtitle'),
            skills = container.find('.js-slider-tehnologes'),
            link = container.find('.js-slider-site'),
            itemsLength = items.length,
            duration = 500,
            flag = true;

        var timeout;

        this.counter = 0;

        var generateMarkups = function() {
            var list = nextBtn.find('.js-slider-list'),
                markups = list.clone();

            prevBtn
                .append(markups)
                .find('.js-slider-item')
                .removeClass('active')
                .eq(this.counter + 1)
                .addClass('active');
        };

        var getDataArrays = function() {
            var dataObject = {
                pics: [],
                title: [],
                skills: [],
                link: []
            };

            $.each(items, function() {
                var $this = $(this);

                dataObject
                    .pics
                    .push($this.data('full'));
                dataObject
                    .title
                    .push($this.data('title'));
                dataObject
                    .skills
                    .push($this.data('skills'));
                dataObject
                    .link
                    .push($this.data('link'));
            });

            return dataObject;
        };

        var slideInLeftBtn = function(slide) {
            var reqItem = items.eq(slide - 1),
                activeItem = items.filter('.active');

            activeItem
                .stop(true, true)
                .animate({
                    'top': '100%'
                }, duration);

            reqItem
                .stop(true, true)
                .animate({
                    'top': '0%'
                }, duration, function() {
                    $(this)
                        .addClass('active')
                        .siblings()
                        .removeClass('active')
                        .css('top', '-100%')
                });

        };

        var slideInRightBtn = function(slide) {
            var items = prevBtn.find('.js-slider-item'),
                activeItem = items.filter('.active'),
                reqSlide = slide + 1;

            if (reqSlide > itemsLength - 1) {
                reqSlide = 0;
            }

            var reqItem = items.eq(reqSlide);

            activeItem
                .stop(true, true)
                .animate({
                    'top': '-100%'
                }, duration);

            reqItem
                .stop(true, true)
                .animate({
                    'top': '0%'
                }, duration, function() {
                    $(this)
                        .addClass('active')
                        .siblings()
                        .removeClass('active')
                        .css('top', '100%')
                });
        };

        var changeMainPicture = function(slide) {
            var image = display.find('.js-slider-display-img');
            var data = getDataArrays();

            image
                .stop(true, true)
                .fadeOut(duration / 2, function() {
                    image.attr('src', data.pics[slide]);
                    $(this).fadeIn(duration / 2);
                });
        };

        var changeTextData = function(slide) {
            var data = getDataArrays();

            aviatitle.generate(data.title[slide], title, 'ru');

            aviatitle.generate(data.skills[slide], skills, 'en');

            link.attr('href', data.link[slide]);
        };

        this.setDefaults = function() {
            var _that = this,
                data = getDataArrays();

            generateMarkups();

            nextBtn
                .find('.js-slider-item')
                .eq(_that.counter - 1)
                .addClass('active');

            prevBtn
                .find('.js-slider-item')
                .eq(_that.counter + 1)
                .addClass('active');

            display
                .find('.js-slider-display-img')
                .attr('src', data.pics[_that.counter]);

            // текстовые описания
            changeTextData(_that.counter);

        };

        this.moveSlide = function(direction) {
            var _that = this;

            var directions = {
                next: function() {

                    if (_that.counter < itemsLength - 1) {
                        _that.counter++;
                    } else {
                        _that.counter = 0;
                    }
                },

                prev: function() {
                    if (_that.counter > 0) {
                        _that.counter--;
                    } else {
                        _that.counter = itemsLength - 1;
                    }
                }
            };

            directions[direction]();

            if (flag) {
                flag = false;

                if (typeof timeout != 'undefined') {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(function() {
                    flag = true;
                }, duration + 50);

                slideInLeftBtn(_that.counter);
                slideInRightBtn(_that.counter);
                changeMainPicture(_that.counter);
                changeTextData(_that.counter);
            }
        }
    };
    return {
        init: function() {
            var slider = new Slider($('.l-works__content'));
            slider.setDefaults();

            $('.js-slider-bth--left').on('click', function(e) {
                e.preventDefault();
                slider.moveSlide('prev');
            });

            $('.js-slider-bth--right').on('click', function(e) {
                e.preventDefault();
                slider.moveSlide('next');
            });
        }
    }
}());
$(function() {
    if ($('#slider').length) {
        sliderCont.init();
    }
});
var animateSkills = (function() {

    var checkDistance = function(scrollTop, element) {
        var
            offset = element.offset().top,
            windowMargin = Math.ceil($(window).height() / 1.5),
            topBorder = offset - scrollTop - windowMargin,
            bottomEdge = element.outerHeight(true) + offset,
            bottomBorder = scrollTop + windowMargin - bottomEdge;

        return topBorder <= 0 && bottomBorder <= 0;
    };

    var item = $('.c-skills-list__item');

    var animationActions = {
        toSkills: function() {
            item.addClass('active');
        }
    };

    return {
        init: function() {
            $(window).on('scroll', function() {
                var scrollTop = $(window).scrollTop();

                if (checkDistance(scrollTop, $('.animate'))) {
                    animationActions['toSkills']();
                } else {
                    //item.removeClass('active');
                }
            })
        }
    }
}());

$(function() {
    if ($('#skills').length) {
        animateSkills.init();
    }
});
//Карта на странице "обо мне"

$(function() {
    var Maps;
    var Routes;
    var App;
    var Utils;
    Utils = {
        settings: {
            debug: false
        },
        clickEvent: 'click',
        log: function(what) {
            if (Utils.settings.debug && window.console) {
                console.log(what);
            }
        }
    };

    //  Для быстрого использования
    var clickEvent = Utils.clickEvent,
        _log = Utils.log;
    Maps = {
        load: function() {
            _log("Map: load script");
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
                'callback=initMap&key=AIzaSyCoinv0op00s_n1cclfA0ExKG-yrhCGTq4';
            document.body.appendChild(script);
        },
        initSettings: function() {
            _log("Map: init settings");
            this.map = null;
            this.marker = null;
            this.settings = {
                zoom: 13,
                center: new google.maps.LatLng(47.090090, 51.850713),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#444444"
                        }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{
                            "color": "#ffffff"
                        }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "labels",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [{
                            "visibility": "simplified"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#d5d5d5"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "color": "#d6d6d6"
                        }]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "color": "#d6d6d6"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [{
                                "color": "#61dac9"
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels",
                        "stylers": [{
                            "color": "#61dac9"
                        }, ]
                    }
                ],
                scrollwheel: false,
                mapTypeControl: false,
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                scaleControl: false,
                streetViewControl: true
            };
        },
        init: function() {
            _log("Map: init Map");
            Maps.initSettings();
            Maps.map = new google.maps.Map(document.getElementById('map'),
                Maps.settings);
            Maps.marker = new google.maps.Marker({
                map: Maps.map,
                draggable: false,
                position: new google.maps.LatLng(47.090090, 51.913713)
            });
        }
    };
    //  Функция для обратного вызова карт при асинхронной загрузке
    window.initMap = function() {
        Maps.init();
    };
    Routes = {
        init: function() {
            _log("Routes: init");
            Maps.load();
        }
    };
    App = {
        init: function() {
            Routes.init();
        }
    };
    if ($('#map').length) {
        App.init();
    }
});
//Параллакс
var ParallaxScroll = (function() {
    return {
        init: function() {
            window.onscroll = function() {
                var parallax = (function() {
                    var
                        bg = document.querySelector('.js-hero-bg'),
                        title = document.querySelector('.js-hero-title'),
                        user = document.querySelector('.js-user');

                    return {
                        move: function(block, windowScroll, strafeAmount) {
                            var
                                strafe = windowScroll / -strafeAmount + '%',
                                style = block.style,
                                transformString = 'translate3d(0,' + strafe + ', 0)';

                            style.top = strafe;
                            style.transform = transformString;
                            style.webkitTransform = transformString;
                        },
                        init: function(wScroll) {
                            this.move(bg, wScroll, 45, 0);
                            this.move(title, wScroll, 15, 50);
                            this.move(user, wScroll, 5, 50);
                        }
                    }
                }());
                var wScroll = window.pageYOffset;

                parallax.init(wScroll);
            };
        }
    }
}());

var ParallaxMouse = (function() {

    return {
        init: function() {
            var
                parallaxContainer = document.getElementById('parallaxMouse'),
                layers = parallaxContainer.children;

            window.addEventListener('mousemove', function(e) {
                var
                    pageX = e.pageX,
                    pageY = e.pageY,
                    initialX = (window.innerWidth / 2) - pageX,
                    initialY = (window.innerHeight / 2) - pageY;

                [].slice.call(layers).forEach(function(layer, i) {
                    var
                        divider = i / 100,
                        positionX = initialX * divider,
                        positionY = initialY * divider,
                        bottomPosition = (window.innerHeight / 2) * divider,
                        layerStyle = layer.style,
                        transformString = 'translate3d(' + positionX + 'px, ' + positionY + 'px, 0)';

                    layerStyle.transform = transformString;
                    layerStyle.webkitTransform = transformString;
                    layerStyle.oTransform = transformString;
                    layerStyle.msTransform = transformString;
                    layerStyle.bottom = '-' + bottomPosition + 'px';
                })
            });
        }
    }
}());

$(function() {
    if ($('#parallaxScroll').length) {
        ParallaxScroll.init();
    }
    if ($('#parallaxMouse').length) {
        ParallaxMouse.init();
    }
});

//BLUR-эффект на странице "портфолио"
var blur = (function() {
    var wrap = document.querySelector('.js-feedback-wrapper'),
        bg = document.querySelector('.js-feedback-bg'),
        bgSection = document.querySelector('.js-reviews-bg');

    function set() {
        var bgWidth = bgSection.offsetWidth,
            posLeft = -wrap.offsetLeft,
            posTop = -wrap.offsetTop,
            offsetImgTop = bgSection.offsetTop,
            offsetTop = posTop + offsetImgTop;

        bg.style.backgroundSize = bgWidth + 'px ' + 'auto';
        bg.style.backgroundPosition = posLeft + 'px ' + offsetTop + 'px';
    }

    return {
        init: function init() {
            set();

            window.addEventListener('resize', set);
        }
    };
}());

$(function() {
    if ($('#feedbackForm').length) {
        blur.init();
    }

    window.onresize = function() {
        if ($('#feedbackForm').length) {
            blur.init();
        }
    }
});
//Форма обратной связи на странице "портфолио"

var feedbackForm = (function() {

    var popup = $('#popup');
    popup.hide();

    return {
        init: function() {
            $("#feedbackForm").submit(function(event) {
                event.preventDefault();

                $('input[name=text]', "#feedbackForm").val('');
                $('input[name=email]', "#feedbackForm").val('');
                $('textarea[name=textarea]', "#feedbackForm").val('');
                popup.fadeIn('fast');

            });

            $('.js-close-popup').click(function() {
                popup.fadeOut('fast');
            });
        }
    }
}());

$(function() {
    if ($('#feedbackForm').length) {
        feedbackForm.init();
    }
});
//Блог на странице "блог"
var scrollMenu = (function() {
    var $news = $('.l-blog-data'),
        $item = $('.js-blog-item'),
        $wrapMenu = $('.js-blog-inner'),
        body = document.body,
        isPositionArticle = [],
        offsetHeight = 200,

        positionArticle = function(element) {
            var len = element.length;
            for (var i = 0; i < len; i++) {
                isPositionArticle[i] = {};
                isPositionArticle[i].top = element
                    .eq(i)
                    .offset()
                    .top - offsetHeight;
                isPositionArticle[i].bottom = isPositionArticle[i].top + element
                    .eq(i)
                    .innerHeight();
            }
        },

        scrollPageFixMenu = function() {
            var scroll = window.pageYOffset;
            if (scroll < $news.offset().top) {
                $wrapMenu.removeClass('fixed');
            } else {
                $wrapMenu.addClass('fixed');
            }
        },

        scrollPage = function() {
            var scroll = window.pageYOffset;
            for (var i = 0; i < isPositionArticle.length; i++) {
                if (scroll >= isPositionArticle[i].top && scroll <= isPositionArticle[i].bottom) {
                    $('.l-blog-nav__item--news')
                        .eq(i)
                        .addClass('active')
                        .siblings()
                        .removeClass('active');
                    $item
                        .eq(i)
                        .addClass('active')
                        .siblings()
                        .removeClass('active');
                }
            }
        },

        clickOnMenu = function(e) {
            var index = $(e.target).index();
            var sectionOffset = $news
                .eq(index)
                .offset()
                .top;
            $(document).off('scroll', scrollPage);
            $('body, html').animate({
                'scrollTop': sectionOffset
            }, function() {
                $(e.target)
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
                $(document).on('scroll', scrollPage);
            });
        },

        addListener = function() {
            $('.js-blog-nav').on('click', clickOnMenu);

            $(document).on('scroll', scrollPage);
            $(document).on('scroll', scrollPageFixMenu);

            $(window).on('load', function(e) {
                positionArticle($news);
            });

            $(window).on('resize', function(e) {
                positionArticle($news);
            });

            $('.l-news-menu__handler').on('click', function(e) {
                e.preventDefault();
                $(this).parents('.l-news-menu').toggleClass('blocked');
            });
        };

    return {
        init: addListener
    }
}());

$(function() {
    if ($('#blog').length) {
        scrollMenu.init();
    }
});

function screen_check() {
    if ($(window).width() <= 448) {
        $('.preloader').remove();
    };
}
screen_check();
$(window).on('resize', function() {
    screen_check();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImF1dGhvcml6YXRpb24uanMiLCJwcmVsb2FkZXIuanMiLCJhbm10eHQuanMiLCJzbGlkZXIuanMiLCJhbmltYXRlLXNraWxscy5qcyIsIm1hcC5qcyIsInBhcmFsbGF4LmpzIiwiYmx1ci5qcyIsImZlZWRiYWNrLWZvcm0uanMiLCJibG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8v0KHRgNC10LvQutCwINGB0LrRgNC+0LvQsCDQuiDQvdGD0LbQvdC+0LzRgyDQsdC70L7QutGDXG5cbnZhciBBcnJvdyA9IChmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBIZWlnaHQgPSAkKCcuanMtc2VjdGlvbi10d28nKS5vZmZzZXQoKS50b3A7XG5cbiAgICAgICQoJy5jLWFycm93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCdib2R5LGh0bWwnKS5hbmltYXRlKHtcbiAgICAgICAgICBzY3JvbGxUb3A6IEhlaWdodFxuICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KCkpO1xuXG4vL9CT0LDQvNCx0YPRgNCz0LXRgC3QvNC10L3RjlxudmFyIEhhbWJ1cmdlciA9IChmdW5jdGlvbiAoKSB7XG4gIHZhclxuICAgIGhhbWJ1cmdlciA9ICQoJy5qcy1oYW1idXJnZXInKSxcbiAgICBuYXZDb250YWluZXIgPSAkKCcuanMtbmF2aWdhdGlvbicpLFxuICAgIG5hdkNvbnRlbnQgPSAkKCcuYy1uYXZpZ2F0aW9uJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBoYW1idXJnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgX3RoaXMudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBuYXZDb250ZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgbmF2Q29udGFpbmVyLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KCkpO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCQoJyNoYW1idXJnZXInKS5sZW5ndGgpIHtcbiAgICBIYW1idXJnZXIuaW5pdCgpO1xuICB9XG4gIGlmICgkKCcjYXJyb3cnKS5sZW5ndGgpIHtcbiAgICBBcnJvdy5pbml0KCk7XG4gIH1cbn0pOyIsIi8v0JDQstGC0L7RgNC40LfQsNGG0LjRjyDQvdCwINCz0LvQsNCy0L3QvtC5INGB0YLRgNCw0L3QuNGG0LVcbnZhciBBdXRob3JpemF0aW9uQnV0dG9uID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyXG4gICAgYXV0aG9yaXphdGlvbiA9ICQoJy5qcy1hdXRob3JpemF0aW9uJyksXG4gICAgY2FyZEZsaXAgPSAkKCcubC1jYXJkX193cmFwcGVyJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBhdXRob3JpemF0aW9uLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAkKCcjYXV0aG9yaXphdGlvbkJ1dHRvbicpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FyZEZsaXAudG9nZ2xlQ2xhc3MoJ2ZsaXAnKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSgpKTtcblxudmFyIEF1dGhvcml6YXRpb25TdWJtaXQgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICQoXCIjYXV0aG9yaXphdGlvblwiKS5zdWJtaXQoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKCEoJChcIiNub1JvYm90XCIpLnByb3AoXCJjaGVja2VkXCIpICYmICQoJ2lucHV0W25hbWU9cmFkaW9dOmNoZWNrZWQnLCAnI2F1dGhvcml6YXRpb24nKS52YWwoKSA9PSAxKSkge1xuICAgICAgICAgICAgJChcIiN2YWxpZGF0aW9uMVwiKS50ZXh0KCfQoNC+0LHQvtGC0Ysg0L3QsNC8INC90LUg0L3Rg9C20L3RiycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChcIiN2YWxpZGF0aW9uMVwiKS50ZXh0KCfQl9Cw0LzQtdGH0LDRgtC10LvRjNC90L4hINCh0LDQsdC80LjRgiDRgNC10LDQu9C40LfRg9GOINC/0L7Qt9C20LUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KCkpO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCQoJyNhdXRob3JpemF0aW9uQnV0dG9uJykubGVuZ3RoKSB7XG4gICAgQXV0aG9yaXphdGlvbkJ1dHRvbi5pbml0KCk7XG4gIH1cbiAgaWYgKCQoJyNhdXRob3JpemF0aW9uJykubGVuZ3RoKSB7XG4gICAgQXV0aG9yaXphdGlvblN1Ym1pdC5pbml0KCk7XG4gIH1cbn0pO1xuIiwiLy/Qv9GA0LXQu9C+0LDQtNC10YAg0LTQu9GPINCy0YHQtdGFINGB0YLRgNCw0L3QuNGGXG52YXIgcHJlbG9hZGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyXG4gICAgcHJlbG9hZGVyID0gJCgnLnByZWxvYWRlcicpLFxuICAgIHBlcnNlbnRzVG90YWwgPSAwLFxuICAgIGNhcmRBbmltYXRlID0gJCgnLmwtY2FyZF9fd3JhcHBlcicpO1xuICB2YXIgaW1nUGF0aCA9ICQoJyonKS5tYXAoZnVuY3Rpb24gKGluZCwgZWxlbWVudCkge1xuXG4gICAgdmFyXG4gICAgICBiYWNrZ3JvdW5kID0gJChlbGVtZW50KS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcbiAgICAgIHBhdGggPSAnJztcbiAgICB2YXIgaXNJbWcgPSAkKGVsZW1lbnQpLmlzKCdpbWcnKTtcblxuICAgIGlmIChiYWNrZ3JvdW5kICE9ICdub25lJykge1xuICAgICAgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgJycpLnJlcGxhY2UoJ1wiKScsJycpXG4gICAgfVxuXG4gICAgaWYgKGlzSW1nKSB7XG4gICAgICBwYXRoID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKVxuICAgIH1cblxuICAgIGlmIChwYXRoKSByZXR1cm4gcGF0aDtcbiAgfSk7XG5cbiAgdmFyIHNldFBlcnNlbnRzID0gZnVuY3Rpb24gKHRvdGFsLCBjdXJyZW50KSB7XG5cbiAgICB2YXIgcGVyc2VudHMgPSBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICoxMDApO1xuICAgICQoJy5qcy1wZXJjZW50cycpLnRleHQocGVyc2VudHMgKyAnJScpO1xuXG4gICAgaWYgKHBlcnNlbnRzID49IDEwMCkge1xuICAgICAgcHJlbG9hZGVyLmZhZGVPdXQoKTtcbiAgICAgIGNhcmRBbmltYXRlLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGxvYWRJbWFnZXMgPSBmdW5jdGlvbiAoaW1hZ2VzKSB7XG4gICAgaWYgKCFpbWFnZXMubGVuZ3RoKSBwcmVsb2FkZXIuZmFkZU91dCgpO1xuXG4gICAgaW1hZ2VzLmZvckVhY2goZnVuY3Rpb24gKGltZywgaSwgaW1hZ2VzKSB7XG4gICAgICB2YXIgZmFrZUltYWdlcyA9ICQoJzxpbWc+Jywge1xuICAgICAgICBhdHRyOiB7XG4gICAgICAgICAgc3JjOiBpbWdcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGZha2VJbWFnZXMub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBlcnNlbnRzVG90YWwrKztcbiAgICAgICAgc2V0UGVyc2VudHMoaW1hZ2VzLmxlbmd0aCwgcGVyc2VudHNUb3RhbCk7XG4gICAgICB9KVxuICAgIH0pO1xuXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1ncyA9IGltZ1BhdGgudG9BcnJheSgpO1xuICAgICAgbG9hZEltYWdlcyhpbWdzKTtcbiAgICB9XG4gIH1cbn0oKSk7XG5cbiQoZnVuY3Rpb24gKCkge1xuICBwcmVsb2FkZXIuaW5pdCgpO1xufSk7IiwiLy/QkNC90LjQvNCw0YbQuNGPINC00LvRjyDQsdGD0LrQsiDRgdC70LDQudC00LXRgNCwINC90LAg0YHRgtGA0LDQvdC40YbQtSBcItC/0L7RgNGC0YTQvtC70LjQvlwiXHJcblxyXG5pZiAoJCgnI3NsaWRlcicpLmxlbmd0aCkge1xyXG4gIHZhciBhdmlhdGl0bGUgPSB7XHJcbiAgICBnZW5lcmF0ZTogZnVuY3Rpb24gKHN0cmluZywgYmxvY2spIHtcclxuICAgICAgdmFyIHdvcmRzQXJyYXkgPSBzdHJpbmcuc3BsaXQoJyAnKSxcclxuICAgICAgICBzdHJpbmdBcnJheSA9IHN0cmluZy5zcGxpdCgnJyksXHJcbiAgICAgICAgc2VudGVuY2UgPSBbXSxcclxuICAgICAgICB3b3JkID0gJyc7XHJcblxyXG4gICAgICBibG9jay50ZXh0KCcnKTtcclxuXHJcbiAgICAgIHdvcmRzQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoY3VycmVudFdvcmQpIHtcclxuICAgICAgICB2YXIgd29yZHNBcnJheSA9IGN1cnJlbnRXb3JkLnNwbGl0KCcnKTtcclxuXHJcbiAgICAgICAgd29yZHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcclxuICAgICAgICAgIHZhciBsZXR0ZXJIdG1sID0gJzxzcGFuIGNsYXNzPVwibGV0dGVyLXNwYW5cIj4nICsgbGV0dGVyICsgJzwvc3Bhbj4nO1xyXG5cclxuICAgICAgICAgIHdvcmQgKz0gbGV0dGVySHRtbDtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIHdvcmRIVE1MID0gJzxzcGFuIGNsYXNzPVwibGV0dGVyLXdvcmRcIj4nICsgd29yZCArICc8L3NwYW4+JztcclxuXHJcbiAgICAgICAgc2VudGVuY2UucHVzaCh3b3JkSFRNTCk7XHJcbiAgICAgICAgd29yZCA9ICcnO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGJsb2NrLmFwcGVuZChzZW50ZW5jZS5qb2luKCcgJykpO1xyXG5cclxuICAgICAgLy8g0LDQvdC40LzQsNGG0LjRjyDQv9C+0Y/QstC70LXQvdC40Y9cclxuICAgICAgdmFyIGxldHRlcnMgPSBibG9jay5maW5kKCcubGV0dGVyLXNwYW4nKSxcclxuICAgICAgICBjb3VudGVyID0gMCxcclxuICAgICAgICB0aW1lcixcclxuICAgICAgICBkdXJhdGlvbiA9IDUwMCAvIHN0cmluZ0FycmF5Lmxlbmd0aDtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNob3dMZXR0ZXJzKCkge1xyXG4gICAgICAgIHZhciBjdXJyZW50TGV0dGVyID0gbGV0dGVycy5lcShjb3VudGVyKTtcclxuXHJcbiAgICAgICAgY3VycmVudExldHRlci5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgY291bnRlcisrO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHRpbWVyICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRpbWVyID0gc2V0VGltZW91dChzaG93TGV0dGVycywgZHVyYXRpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzaG93TGV0dGVycygpO1xyXG5cclxuICAgIH1cclxuICB9O1xyXG59XHJcbiIsIi8v0KHQu9Cw0LnQtNC10YAg0L3QsCDRgdGC0YDQsNC90LjRhtC1IFwi0L/QvtGA0YLRhNC+0LvQuNC+XCJcblxudmFyIHNsaWRlckNvbnQgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgU2xpZGVyID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgIHZhciBuZXh0QnRuID0gY29udGFpbmVyLmZpbmQoJy5qcy1zbGlkZXItYnRoLS1sZWZ0JyksXG4gICAgICBwcmV2QnRuID0gY29udGFpbmVyLmZpbmQoJy5qcy1zbGlkZXItYnRoLS1yaWdodCcpLFxuICAgICAgaXRlbXMgPSBuZXh0QnRuLmZpbmQoJy5qcy1zbGlkZXItaXRlbScpLFxuICAgICAgZGlzcGxheSA9IGNvbnRhaW5lci5maW5kKCcuanMtc2xpZGVyLWRpc3BsYXknKSxcbiAgICAgIHRpdGxlID0gY29udGFpbmVyLmZpbmQoJy5qcy1zbGlkZXItc3VidGl0bGUnKSxcbiAgICAgIHNraWxscyA9IGNvbnRhaW5lci5maW5kKCcuanMtc2xpZGVyLXRlaG5vbG9nZXMnKSxcbiAgICAgIGxpbmsgPSBjb250YWluZXIuZmluZCgnLmpzLXNsaWRlci1zaXRlJyksXG4gICAgICBpdGVtc0xlbmd0aCA9IGl0ZW1zLmxlbmd0aCxcbiAgICAgIGR1cmF0aW9uID0gNTAwLFxuICAgICAgZmxhZyA9IHRydWU7XG5cbiAgICB2YXIgdGltZW91dDtcblxuICAgIHRoaXMuY291bnRlciA9IDA7XG5cbiAgICB2YXIgZ2VuZXJhdGVNYXJrdXBzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGxpc3QgPSBuZXh0QnRuLmZpbmQoJy5qcy1zbGlkZXItbGlzdCcpLFxuICAgICAgICBtYXJrdXBzID0gbGlzdC5jbG9uZSgpO1xuXG4gICAgICBwcmV2QnRuXG4gICAgICAgIC5hcHBlbmQobWFya3VwcylcbiAgICAgICAgLmZpbmQoJy5qcy1zbGlkZXItaXRlbScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmVxKHRoaXMuY291bnRlciArIDEpXG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBnZXREYXRhQXJyYXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRhdGFPYmplY3QgPSB7XG4gICAgICAgIHBpY3M6IFtdLFxuICAgICAgICB0aXRsZTogW10sXG4gICAgICAgIHNraWxsczogW10sXG4gICAgICAgIGxpbms6IFtdXG4gICAgICB9O1xuXG4gICAgICAkLmVhY2goaXRlbXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICBkYXRhT2JqZWN0XG4gICAgICAgICAgLnBpY3NcbiAgICAgICAgICAucHVzaCgkdGhpcy5kYXRhKCdmdWxsJykpO1xuICAgICAgICBkYXRhT2JqZWN0XG4gICAgICAgICAgLnRpdGxlXG4gICAgICAgICAgLnB1c2goJHRoaXMuZGF0YSgndGl0bGUnKSk7XG4gICAgICAgIGRhdGFPYmplY3RcbiAgICAgICAgICAuc2tpbGxzXG4gICAgICAgICAgLnB1c2goJHRoaXMuZGF0YSgnc2tpbGxzJykpO1xuICAgICAgICBkYXRhT2JqZWN0XG4gICAgICAgICAgLmxpbmtcbiAgICAgICAgICAucHVzaCgkdGhpcy5kYXRhKCdsaW5rJykpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkYXRhT2JqZWN0O1xuICAgIH07XG5cbiAgICB2YXIgc2xpZGVJbkxlZnRCdG4gPSBmdW5jdGlvbiAoc2xpZGUpIHtcbiAgICAgIHZhciByZXFJdGVtID0gaXRlbXMuZXEoc2xpZGUgLSAxKSxcbiAgICAgICAgYWN0aXZlSXRlbSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpO1xuXG4gICAgICBhY3RpdmVJdGVtXG4gICAgICAgIC5zdG9wKHRydWUsIHRydWUpXG4gICAgICAgIC5hbmltYXRlKHtcbiAgICAgICAgICAndG9wJzogJzEwMCUnXG4gICAgICAgIH0sIGR1cmF0aW9uKTtcblxuICAgICAgcmVxSXRlbVxuICAgICAgICAuc3RvcCh0cnVlLCB0cnVlKVxuICAgICAgICAuYW5pbWF0ZSh7XG4gICAgICAgICAgJ3RvcCc6ICcwJSdcbiAgICAgICAgfSwgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgICAuc2libGluZ3MoKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICAgLmNzcygndG9wJywgJy0xMDAlJylcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgdmFyIHNsaWRlSW5SaWdodEJ0biA9IGZ1bmN0aW9uIChzbGlkZSkge1xuICAgICAgdmFyIGl0ZW1zID0gcHJldkJ0bi5maW5kKCcuanMtc2xpZGVyLWl0ZW0nKSxcbiAgICAgICAgYWN0aXZlSXRlbSA9IGl0ZW1zLmZpbHRlcignLmFjdGl2ZScpLFxuICAgICAgICByZXFTbGlkZSA9IHNsaWRlICsgMTtcblxuICAgICAgaWYgKHJlcVNsaWRlID4gaXRlbXNMZW5ndGggLSAxKSB7XG4gICAgICAgIHJlcVNsaWRlID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcUl0ZW0gPSBpdGVtcy5lcShyZXFTbGlkZSk7XG5cbiAgICAgIGFjdGl2ZUl0ZW1cbiAgICAgICAgLnN0b3AodHJ1ZSwgdHJ1ZSlcbiAgICAgICAgLmFuaW1hdGUoe1xuICAgICAgICAgICd0b3AnOiAnLTEwMCUnXG4gICAgICAgIH0sIGR1cmF0aW9uKTtcblxuICAgICAgcmVxSXRlbVxuICAgICAgICAuc3RvcCh0cnVlLCB0cnVlKVxuICAgICAgICAuYW5pbWF0ZSh7XG4gICAgICAgICAgJ3RvcCc6ICcwJSdcbiAgICAgICAgfSwgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgICAuc2libGluZ3MoKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICAgLmNzcygndG9wJywgJzEwMCUnKVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGNoYW5nZU1haW5QaWN0dXJlID0gZnVuY3Rpb24gKHNsaWRlKSB7XG4gICAgICB2YXIgaW1hZ2UgPSBkaXNwbGF5LmZpbmQoJy5qcy1zbGlkZXItZGlzcGxheS1pbWcnKTtcbiAgICAgIHZhciBkYXRhID0gZ2V0RGF0YUFycmF5cygpO1xuXG4gICAgICBpbWFnZVxuICAgICAgICAuc3RvcCh0cnVlLCB0cnVlKVxuICAgICAgICAuZmFkZU91dChkdXJhdGlvbiAvIDIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpbWFnZS5hdHRyKCdzcmMnLCBkYXRhLnBpY3Nbc2xpZGVdKTtcbiAgICAgICAgICAkKHRoaXMpLmZhZGVJbihkdXJhdGlvbiAvIDIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGNoYW5nZVRleHREYXRhID0gZnVuY3Rpb24gKHNsaWRlKSB7XG4gICAgICB2YXIgZGF0YSA9IGdldERhdGFBcnJheXMoKTtcblxuICAgICAgYXZpYXRpdGxlLmdlbmVyYXRlKGRhdGEudGl0bGVbc2xpZGVdLCB0aXRsZSwgJ3J1Jyk7XG5cbiAgICAgIGF2aWF0aXRsZS5nZW5lcmF0ZShkYXRhLnNraWxsc1tzbGlkZV0sIHNraWxscywgJ2VuJyk7XG5cbiAgICAgIGxpbmsuYXR0cignaHJlZicsIGRhdGEubGlua1tzbGlkZV0pO1xuICAgIH07XG5cbiAgICB0aGlzLnNldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGF0ID0gdGhpcyxcbiAgICAgICAgZGF0YSA9IGdldERhdGFBcnJheXMoKTtcblxuICAgICAgZ2VuZXJhdGVNYXJrdXBzKCk7XG5cbiAgICAgIG5leHRCdG5cbiAgICAgICAgLmZpbmQoJy5qcy1zbGlkZXItaXRlbScpXG4gICAgICAgIC5lcShfdGhhdC5jb3VudGVyIC0gMSlcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgcHJldkJ0blxuICAgICAgICAuZmluZCgnLmpzLXNsaWRlci1pdGVtJylcbiAgICAgICAgLmVxKF90aGF0LmNvdW50ZXIgKyAxKVxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICBkaXNwbGF5XG4gICAgICAgIC5maW5kKCcuanMtc2xpZGVyLWRpc3BsYXktaW1nJylcbiAgICAgICAgLmF0dHIoJ3NyYycsIGRhdGEucGljc1tfdGhhdC5jb3VudGVyXSk7XG5cbiAgICAgIC8vINGC0LXQutGB0YLQvtCy0YvQtSDQvtC/0LjRgdCw0L3QuNGPXG4gICAgICBjaGFuZ2VUZXh0RGF0YShfdGhhdC5jb3VudGVyKTtcblxuICAgIH07XG5cbiAgICB0aGlzLm1vdmVTbGlkZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgIHZhciBfdGhhdCA9IHRoaXM7XG5cbiAgICAgIHZhciBkaXJlY3Rpb25zID0ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICBpZiAoX3RoYXQuY291bnRlciA8IGl0ZW1zTGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgX3RoYXQuY291bnRlcisrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhhdC5jb3VudGVyID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHJldjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChfdGhhdC5jb3VudGVyID4gMCkge1xuICAgICAgICAgICAgX3RoYXQuY291bnRlci0tO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhhdC5jb3VudGVyID0gaXRlbXNMZW5ndGggLSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZGlyZWN0aW9uc1tkaXJlY3Rpb25dKCk7XG5cbiAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgIGZsYWcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIHRpbWVvdXQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZmxhZyA9IHRydWU7XG4gICAgICAgIH0sIGR1cmF0aW9uICsgNTApO1xuXG4gICAgICAgIHNsaWRlSW5MZWZ0QnRuKF90aGF0LmNvdW50ZXIpO1xuICAgICAgICBzbGlkZUluUmlnaHRCdG4oX3RoYXQuY291bnRlcik7XG4gICAgICAgIGNoYW5nZU1haW5QaWN0dXJlKF90aGF0LmNvdW50ZXIpO1xuICAgICAgICBjaGFuZ2VUZXh0RGF0YShfdGhhdC5jb3VudGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHJldHVybiB7XG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNsaWRlciA9IG5ldyBTbGlkZXIoJCgnLmwtd29ya3NfX2NvbnRlbnQnKSk7XG4gICAgICBzbGlkZXIuc2V0RGVmYXVsdHMoKTtcblxuICAgICAgJCgnLmpzLXNsaWRlci1idGgtLWxlZnQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNsaWRlci5tb3ZlU2xpZGUoJ3ByZXYnKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuanMtc2xpZGVyLWJ0aC0tcmlnaHQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNsaWRlci5tb3ZlU2xpZGUoJ25leHQnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSgpKTtcbiQoZnVuY3Rpb24gKCkge1xuICBpZiAoJCgnI3NsaWRlcicpLmxlbmd0aCkge1xuICAgIHNsaWRlckNvbnQuaW5pdCgpO1xuICB9XG59KTsiLCJ2YXIgYW5pbWF0ZVNraWxscyA9IChmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGNoZWNrRGlzdGFuY2UgPSBmdW5jdGlvbiAoc2Nyb2xsVG9wLCBlbGVtZW50KSB7XG4gICAgdmFyXG4gICAgICBvZmZzZXQgPSBlbGVtZW50Lm9mZnNldCgpLnRvcCxcbiAgICAgIHdpbmRvd01hcmdpbiA9IE1hdGguY2VpbCgkKHdpbmRvdykuaGVpZ2h0KCkgLzEuNSksXG4gICAgICB0b3BCb3JkZXIgPSBvZmZzZXQgLSBzY3JvbGxUb3AgLSB3aW5kb3dNYXJnaW4sXG4gICAgICBib3R0b21FZGdlID0gZWxlbWVudC5vdXRlckhlaWdodCh0cnVlKSArIG9mZnNldCxcbiAgICAgIGJvdHRvbUJvcmRlciA9IHNjcm9sbFRvcCArIHdpbmRvd01hcmdpbiAtIGJvdHRvbUVkZ2U7XG5cbiAgICByZXR1cm4gdG9wQm9yZGVyIDw9MCAmJiBib3R0b21Cb3JkZXIgPD0wO1xuICB9O1xuXG4gIHZhciBpdGVtID0gJCgnLmMtc2tpbGxzLWxpc3RfX2l0ZW0nKTtcblxuICB2YXIgYW5pbWF0aW9uQWN0aW9ucyA9IHtcbiAgICB0b1NraWxsczogZnVuY3Rpb24gKCkge1xuICAgICAgaXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgaWYgKGNoZWNrRGlzdGFuY2Uoc2Nyb2xsVG9wLCAkKCcuYW5pbWF0ZScpKSkge1xuICAgICAgICAgIGFuaW1hdGlvbkFjdGlvbnNbJ3RvU2tpbGxzJ10oKTtcbiAgICAgICAgfSBlbHNle1xuICAgICAgICAgIC8vaXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG59KCkpO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCQoJyNza2lsbHMnKS5sZW5ndGgpIHtcbiAgICBhbmltYXRlU2tpbGxzLmluaXQoKTtcbiAgfVxufSk7IiwiLy/QmtCw0YDRgtCwINC90LAg0YHRgtGA0LDQvdC40YbQtSBcItC+0LHQviDQvNC90LVcIlxuXG4kKGZ1bmN0aW9uICgpIHtcblx0dmFyIE1hcHM7XG5cdHZhciBSb3V0ZXM7XG5cdHZhciBBcHA7XG5cdHZhciBVdGlscztcblx0VXRpbHMgPSB7XG5cdFx0c2V0dGluZ3M6IHtcblx0XHRcdFx0ZGVidWc6IGZhbHNlXG5cdFx0fSxcblx0XHRjbGlja0V2ZW50OiAnY2xpY2snLFxuXHRcdGxvZzogZnVuY3Rpb24od2hhdCkge1xuXHRcdFx0XHRpZiAoIFV0aWxzLnNldHRpbmdzLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cod2hhdCk7XG5cdFx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gINCU0LvRjyDQsdGL0YHRgtGA0L7Qs9C+INC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPXG5cdHZhciBjbGlja0V2ZW50ID0gVXRpbHMuY2xpY2tFdmVudCxcblx0XHRcdFx0XHRcdF9sb2cgPSBVdGlscy5sb2c7XG5cdE1hcHMgPSB7XG5cdFx0bG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdF9sb2coIFwiTWFwOiBsb2FkIHNjcmlwdFwiICk7XG5cdFx0XHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRcdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRcdFx0c2NyaXB0LnNyYyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanM/dj0zLmV4cCZzZW5zb3I9ZmFsc2UmJyArXG5cdFx0XHRcdFx0XHQnY2FsbGJhY2s9aW5pdE1hcCZrZXk9QUl6YVN5Q29pbnYwb3AwMHNfbjFjY2xmQTBFeEtHLXlyaENHVHE0Jztcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXHRcdH0sXG5cdFx0aW5pdFNldHRpbmdzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0X2xvZyggXCJNYXA6IGluaXQgc2V0dGluZ3NcIiApO1xuXHRcdFx0XHR0aGlzLm1hcCA9IG51bGw7XG5cdFx0XHRcdHRoaXMubWFya2VyID0gbnVsbDtcblx0XHRcdFx0dGhpcy5zZXR0aW5ncyA9IHtcblx0XHRcdFx0XHRcdHpvb206IDEyLFxuXHRcdFx0XHRcdFx0Y2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDYwLjAxMTY5NSwgMzAuMjU2NzQ0KSxcblx0XHRcdFx0XHRcdG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXG4gICAgICAgICAgICBzdHlsZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzLnRleHQuZmlsbFwiLFxuICAgICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNDQ0NDQ0XCJcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGVcIixcbiAgICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiI2ZmZmZmZlwiXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXG4gICAgICAgICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzXCIsXG4gICAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuICAgICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuICAgICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNkNWQ1ZDVcIlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcbiAgICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNkNmQ2ZDZcIlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcbiAgICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICAgICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNkNmQ2ZDZcIlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcbiAgICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHMuaWNvblwiLFxuICAgICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwidHJhbnNpdFwiLFxuICAgICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcbiAgICAgICAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6IFwiIzYxZGFjOVwiXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9uXCJcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuICAgICAgICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImxhYmVsc1wiLFxuICAgICAgICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNjFkYWM5XCJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuXHRcdFx0XHRcdFx0c2Nyb2xsd2hlZWw6IGZhbHNlLFxuXHRcdFx0XHRcdFx0bWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cGFuQ29udHJvbDogdHJ1ZSxcblx0XHRcdFx0XHRcdHBhbkNvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0NFTlRFUlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHpvb21Db250cm9sOiB0cnVlLFxuXHRcdFx0XHRcdFx0em9vbUNvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX0NFTlRFUlxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHNjYWxlQ29udHJvbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRzdHJlZXRWaWV3Q29udHJvbDogdHJ1ZVxuXHRcdFx0XHR9O1xuXHRcdH0sXG5cdFx0aW5pdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdF9sb2coIFwiTWFwOiBpbml0IE1hcFwiICk7XG5cdFx0XHRcdE1hcHMuaW5pdFNldHRpbmdzKCk7XG5cdFx0XHRcdE1hcHMubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksXG5cdFx0XHRcdFx0XHRNYXBzLnNldHRpbmdzKTtcblx0XHRcdFx0TWFwcy5tYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdFx0XHRcdG1hcDogTWFwcy5tYXAsXG5cdFx0XHRcdFx0XHRkcmFnZ2FibGU6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNjAuMDExNjk1LCAzMC4yNTY3NDQpXG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0Ly8gINCk0YPQvdC60YbQuNGPINC00LvRjyDQvtCx0YDQsNGC0L3QvtCz0L4g0LLRi9C30L7QstCwINC60LDRgNGCINC/0YDQuCDQsNGB0LjQvdGF0YDQvtC90L3QvtC5INC30LDQs9GA0YPQt9C60LVcblx0d2luZG93LmluaXRNYXAgPSBmdW5jdGlvbigpIHtcblx0XHRNYXBzLmluaXQoKTtcblx0fTtcblx0Um91dGVzID0ge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0X2xvZyggXCJSb3V0ZXM6IGluaXRcIiApO1xuXHRcdFx0XHRNYXBzLmxvYWQoKTtcblx0XHR9XG5cdH07XG5cdEFwcCA9IHtcblx0XHRcdGluaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFJvdXRlcy5pbml0KCk7XG5cdFx0XHR9XG5cdH07XG5cdGlmICgkKCcjbWFwJykubGVuZ3RoKSB7XG4gICAgQXBwLmluaXQoKTtcbiAgfVxufSk7IiwiLy/Qn9Cw0YDQsNC70LvQsNC60YFcbnZhciBQYXJhbGxheFNjcm9sbCA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFyYWxsYXg9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXJcbiAgICAgICAgICAgIGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWhlcm8tYmcnKSxcbiAgICAgICAgICAgIHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWhlcm8tdGl0bGUnKSxcbiAgICAgICAgICAgIHVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdXNlcicpO1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vdmU6IGZ1bmN0aW9uIChibG9jaywgd2luZG93U2Nyb2xsLCBzdHJhZmVBbW91bnQpIHtcbiAgICAgICAgICAgICAgdmFyXG4gICAgICAgICAgICAgICAgc3RyYWZlID0gd2luZG93U2Nyb2xsLy1zdHJhZmVBbW91bnQgKyAnJScsXG4gICAgICAgICAgICAgICAgc3R5bGUgPSBibG9jay5zdHlsZSxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgPSAndHJhbnNsYXRlM2QoMCwnKyBzdHJhZmUgKycsIDApJztcblxuICAgICAgICAgICAgICBzdHlsZS50b3AgPSBzdHJhZmU7XG4gICAgICAgICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcbiAgICAgICAgICAgICAgc3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICh3U2Nyb2xsKSB7XG4gICAgICAgICAgICAgIHRoaXMubW92ZShiZywgd1Njcm9sbCwgNDUsIDApO1xuICAgICAgICAgICAgICB0aGlzLm1vdmUodGl0bGUsIHdTY3JvbGwsIDE1LCA1MCk7XG4gICAgICAgICAgICAgIHRoaXMubW92ZSh1c2VyLCB3U2Nyb2xsLCA1LCA1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KCkpO1xuICAgICAgICB2YXIgd1Njcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblxuICAgICAgICBwYXJhbGxheC5pbml0KHdTY3JvbGwpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn0oKSk7XG5cbnZhciBQYXJhbGxheE1vdXNlID0gKGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhclxuICAgICAgICBwYXJhbGxheENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXJhbGxheE1vdXNlJyksXG4gICAgICAgIGxheWVycyA9IHBhcmFsbGF4Q29udGFpbmVyLmNoaWxkcmVuO1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyXG4gICAgICAgICAgcGFnZVggPSBlLnBhZ2VYLFxuICAgICAgICAgIHBhZ2VZID0gZS5wYWdlWSxcbiAgICAgICAgICBpbml0aWFsWCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gcGFnZVgsXG4gICAgICAgICAgaW5pdGlhbFkgPSAod2luZG93LmlubmVySGVpZ2h0IC8gMikgLSBwYWdlWTtcblxuICAgICAgICBbXS5zbGljZS5jYWxsKGxheWVycykuZm9yRWFjaChmdW5jdGlvbiAobGF5ZXIsIGkpIHtcbiAgICAgICAgICB2YXJcbiAgICAgICAgICAgIGRpdmlkZXIgPSBpIC8gMTAwLFxuICAgICAgICAgICAgcG9zaXRpb25YID0gaW5pdGlhbFggKiBkaXZpZGVyLFxuICAgICAgICAgICAgcG9zaXRpb25ZID0gaW5pdGlhbFkgKiBkaXZpZGVyLFxuICAgICAgICAgICAgYm90dG9tUG9zaXRpb24gPSAod2luZG93LmlubmVySGVpZ2h0IC8gMikgKiBkaXZpZGVyLFxuICAgICAgICAgICAgbGF5ZXJTdHlsZSA9IGxheWVyLnN0eWxlLFxuICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nID0gJ3RyYW5zbGF0ZTNkKCcgKyBwb3NpdGlvblggKyAncHgsICcgKyBwb3NpdGlvblkgKyAncHgsIDApJztcblxuICAgICAgICAgIGxheWVyU3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgIGxheWVyU3R5bGUud2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgIGxheWVyU3R5bGUub1RyYW5zZm9ybSA9IHRyYW5zZm9ybVN0cmluZztcbiAgICAgICAgICBsYXllclN0eWxlLm1zVHJhbnNmb3JtID0gdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgIGxheWVyU3R5bGUuYm90dG9tID0gJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KCkpO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCQoJyNwYXJhbGxheFNjcm9sbCcpLmxlbmd0aCkge1xuICAgIFBhcmFsbGF4U2Nyb2xsLmluaXQoKTtcbiAgfVxuICBpZiAoJCgnI3BhcmFsbGF4TW91c2UnKS5sZW5ndGgpIHtcbiAgICBQYXJhbGxheE1vdXNlLmluaXQoKTtcbiAgfVxufSk7XG4iLCIvL0JMVVIt0Y3RhNGE0LXQutGCINC90LAg0YHRgtGA0LDQvdC40YbQtSBcItC/0L7RgNGC0YTQvtC70LjQvlwiXG52YXIgYmx1ciA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB3cmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWZlZWRiYWNrLXdyYXBwZXInKSxcblx0ICAgIGJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWZlZWRiYWNrLWJnJyksXG5cdCAgICBiZ1NlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtcmV2aWV3cy1iZycpO1xuXG5cdGZ1bmN0aW9uIHNldCgpIHtcblx0XHR2YXIgYmdXaWR0aCA9IGJnU2VjdGlvbi5vZmZzZXRXaWR0aCxcblx0XHQgICAgcG9zTGVmdCA9IC13cmFwLm9mZnNldExlZnQsXG5cdFx0ICAgIHBvc1RvcCA9IC13cmFwLm9mZnNldFRvcCxcblx0XHQgICAgb2Zmc2V0SW1nVG9wID0gYmdTZWN0aW9uLm9mZnNldFRvcCxcblx0XHQgICAgb2Zmc2V0VG9wID0gcG9zVG9wICsgb2Zmc2V0SW1nVG9wO1xuXG5cdFx0Ymcuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBiZ1dpZHRoICsgJ3B4ICcgKyAnYXV0byc7XG5cdFx0Ymcuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gcG9zTGVmdCArICdweCAnICsgb2Zmc2V0VG9wICsgJ3B4Jztcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHNldCgpO1xuXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc2V0KTtcblx0XHR9XG5cdH07XG59KCkpO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCQoJyNmZWVkYmFja0Zvcm0nKS5sZW5ndGgpIHtcbiAgICBibHVyLmluaXQoKTtcbiAgfVxuXG4gIHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJCgnI2ZlZWRiYWNrRm9ybScpLmxlbmd0aCkge1xuICAgICAgYmx1ci5pbml0KCk7XG4gICAgfVxuICB9XG59KTsiLCIvL9Ck0L7RgNC80LAg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9C4INC90LAg0YHRgtGA0LDQvdC40YbQtSBcItC/0L7RgNGC0YTQvtC70LjQvlwiXG5cbnZhciBmZWVkYmFja0Zvcm0gPSAoZnVuY3Rpb24gKCkge1xuXG5cdHZhciBwb3B1cCA9ICQoJyNwb3B1cCcpO1xuXHRwb3B1cC5oaWRlKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAkKFwiI2ZlZWRiYWNrRm9ybVwiKS5zdWJtaXQoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgJCgnaW5wdXRbbmFtZT10ZXh0XScsIFwiI2ZlZWRiYWNrRm9ybVwiKS52YWwoJycpO1xuICAgICAgICAkKCdpbnB1dFtuYW1lPWVtYWlsXScsIFwiI2ZlZWRiYWNrRm9ybVwiKS52YWwoJycpO1xuICAgICAgICAkKCd0ZXh0YXJlYVtuYW1lPXRleHRhcmVhXScsIFwiI2ZlZWRiYWNrRm9ybVwiKS52YWwoJycpO1xuICAgICAgICBwb3B1cC5mYWRlSW4oJ2Zhc3QnKTtcblxuICAgICAgfSk7XG5cbiAgICAgICQoJy5qcy1jbG9zZS1wb3B1cCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcG9wdXAuZmFkZU91dCgnZmFzdCcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59KCkpO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCQoJyNmZWVkYmFja0Zvcm0nKS5sZW5ndGgpIHtcbiAgICBmZWVkYmFja0Zvcm0uaW5pdCgpO1xuICB9XG59KTsiLCIvL9CR0LvQvtCzINC90LAg0YHRgtGA0LDQvdC40YbQtSBcItCx0LvQvtCzXCJcbnZhciBzY3JvbGxNZW51ID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyICRuZXdzID0gJCgnLmwtYmxvZy1kYXRhJyksXG4gICAgJGl0ZW0gPSAkKCcuanMtYmxvZy1pdGVtJyksXG4gICAgJHdyYXBNZW51ID0gJCgnLmpzLWJsb2ctaW5uZXInKSxcbiAgICBib2R5ID0gZG9jdW1lbnQuYm9keSxcbiAgICBpc1Bvc2l0aW9uQXJ0aWNsZSA9IFtdLFxuICAgIG9mZnNldEhlaWdodCA9IDIwMCxcblxuICAgIHBvc2l0aW9uQXJ0aWNsZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICB2YXIgbGVuID0gZWxlbWVudC5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlzUG9zaXRpb25BcnRpY2xlW2ldID0ge307XG4gICAgICAgIGlzUG9zaXRpb25BcnRpY2xlW2ldLnRvcCA9IGVsZW1lbnRcbiAgICAgICAgICAgIC5lcShpKVxuICAgICAgICAgICAgLm9mZnNldCgpXG4gICAgICAgICAgICAudG9wIC0gb2Zmc2V0SGVpZ2h0O1xuICAgICAgICBpc1Bvc2l0aW9uQXJ0aWNsZVtpXS5ib3R0b20gPSBpc1Bvc2l0aW9uQXJ0aWNsZVtpXS50b3AgKyBlbGVtZW50XG4gICAgICAgICAgICAuZXEoaSlcbiAgICAgICAgICAgIC5pbm5lckhlaWdodCgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzY3JvbGxQYWdlRml4TWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICBpZiAoc2Nyb2xsIDwgJG5ld3Mub2Zmc2V0KCkudG9wKSB7XG4gICAgICAgICR3cmFwTWVudS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICR3cmFwTWVudS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2Nyb2xsUGFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlzUG9zaXRpb25BcnRpY2xlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzY3JvbGwgPj0gaXNQb3NpdGlvbkFydGljbGVbaV0udG9wICYmIHNjcm9sbCA8PSBpc1Bvc2l0aW9uQXJ0aWNsZVtpXS5ib3R0b20pIHtcbiAgICAgICAgICAkKCcubC1ibG9nLW5hdl9faXRlbS0tbmV3cycpXG4gICAgICAgICAgICAuZXEoaSlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIC5zaWJsaW5ncygpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICRpdGVtXG4gICAgICAgICAgICAuZXEoaSlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIC5zaWJsaW5ncygpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsaWNrT25NZW51ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBpbmRleCA9ICQoZS50YXJnZXQpLmluZGV4KCk7XG4gICAgICB2YXIgc2VjdGlvbk9mZnNldCA9ICRuZXdzXG4gICAgICAgIC5lcShpbmRleClcbiAgICAgICAgLm9mZnNldCgpXG4gICAgICAgIC50b3A7XG4gICAgICAkKGRvY3VtZW50KS5vZmYoJ3Njcm9sbCcsIHNjcm9sbFBhZ2UpO1xuICAgICAgJCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe1xuICAgICAgICAnc2Nyb2xsVG9wJzogc2VjdGlvbk9mZnNldFxuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKGUudGFyZ2V0KVxuICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAuc2libGluZ3MoKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdzY3JvbGwnLCBzY3JvbGxQYWdlKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBhZGRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICQoJy5qcy1ibG9nLW5hdicpLm9uKCdjbGljaycsIGNsaWNrT25NZW51KTtcblxuICAgICAgJChkb2N1bWVudCkub24oJ3Njcm9sbCcsIHNjcm9sbFBhZ2UpO1xuICAgICAgJChkb2N1bWVudCkub24oJ3Njcm9sbCcsIHNjcm9sbFBhZ2VGaXhNZW51KTtcblxuICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcG9zaXRpb25BcnRpY2xlKCRuZXdzKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHBvc2l0aW9uQXJ0aWNsZSgkbmV3cyk7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmwtbmV3cy1tZW51X19oYW5kbGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5sLW5ld3MtbWVudScpLnRvZ2dsZUNsYXNzKCdibG9ja2VkJyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogYWRkTGlzdGVuZXJcbiAgfVxufSgpKTtcblxuJChmdW5jdGlvbiAoKSB7XG4gIGlmICgkKCcjYmxvZycpLmxlbmd0aCkge1xuICAgIHNjcm9sbE1lbnUuaW5pdCgpO1xuICB9XG59KTtcbiJdfQ==