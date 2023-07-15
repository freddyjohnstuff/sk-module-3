"use strict";
(function () {
    $.fn.skslider = function (options) {

        window.currentImageId = null;

        var activeById = (id) => {

            if(String(id) !== String(window.currentImageId)) {
                window.currentImageId = id;
                $('.sk-container .sk-blocks > li').animate({opacity: 0},150).hide();
                $('.sk-container .sk-blocks > li[data-id=' + id + ']').animate({opacity: 1},150).show();

                $('.sk-container .sk-images > li').animate({opacity: 0},150).hide();
                $('.sk-container .sk-images > li[data-id=' + id + ']').animate({opacity: 1},150).show();

                $('.sk-container  ul.sk-dots > li.sk-dot').removeClass('active');
                $('.sk-container  ul.sk-dots > li[data-id=' + id + ']').addClass('active');

                $('.sk-container ul.sk-names > li.sk-name').removeClass('active');
                $('.sk-container ul.sk-names > li[data-id=' + id + ']').addClass('active');

            }
        };
        var getItemByArrow = (arrow) => {
            var names = [];
            var curIndex = -1;
            $('ul.sk-names > li.sk-name').each((index,element) => {
                var id = $(element).data('id');
                names.push(id);
                if(String(id) === String(window.currentImageId)){
                    curIndex = index;
                }
            });

            var cnt = names.length - 1;
            if(curIndex === -1) {
                newIndex = 0;
            } else {
                var newIndex = parseInt(curIndex) + parseInt(arrow);
                if(newIndex < 0) {
                    newIndex = cnt;
                }
                if(newIndex > cnt) {
                    newIndex = 0;
                }
            }
            return names[newIndex];
        };

        var hideObjects = ()=>{
            $('.sk-container ul.sk-blocks > li:not(:first-child)').hide();
            $('.sk-container ul.sk-images > li:not(:first-child)').hide();
            $('.sk-container ul.sk-dots > li:nth-child(2)').addClass('active');
            $('.sk-container ul.sk-names > li:first-child').addClass('active');
            window.currentImageId = $('.sk-container ul.sk-names > li.active').data('id');
        };
        var bindObjects = ()=>{

            $('ul.sk-names > li.sk-name').on('click', function (e) {
                $('ul.sk-names > li.sk-name').removeClass('active');
                $(this).addClass('active');
                var id = $(this).data('id');
                activeById(id);
            })

            $('ul.sk-dots > li.sk-dot').on('click', function (e) {
                $('ul.sk-dots > li.sk-dot').removeClass('active');
                $(this).addClass('active');
                var id = $(this).data('id');
                activeById(id);
            })

            $('ul.sk-dots > li:not(.sk-dot)').on('click', function (e) {
                var arrow;
                if($(this).hasClass('sk-arr-left')) {
                    arrow = -1;
                } else {
                    arrow = 1;
                }
                var id = getItemByArrow(arrow);
                activeById(id);
            })
        };

        var _this = this, i, j, names = [], dots = [], images =[], itemBlock = {} ;
        var labels = {
            city:'City:',
            area:'Apartment area:',
            time:'Repair time:',
            cost:'Repair Cost:',
        }
        var template = {
                name:'name',
                description: 'description',
                options:{
                    city:'city',
                    area:'area',
                    time:'time',
                    cost:'cost',
                },
                image:'image',
                thumb: 'thumb'
            };
        var defaults = {
            header:'Header sample',
            slides:[]
        }
        var opts = $.extend( {}, defaults, options );


        if(opts.slides.length > 0) {
            var infoBlocks = $('<ul>', {class:'sk-blocks'});
            for (i in opts.slides) {
                let item = opts.slides[i];
                let id = String(btoa(item.name))
                    .replace('==','')
                    .replace('=','');
                names.push('<li class="sk-name" data-id="' + id + '"><a href="javascript:;">' + item.name + '</a></li>');
                dots.push('<li class="sk-dot" data-id="' + id + '"><a href="javascript:;" \>&bull;</a></li>');
                images.push('<li class="sk-images__item" data-id="' + id + '"><img src="' + item.image + '" class="sk-images__image"></li>');
                itemBlock = $('<li>', {class:'sk-block', 'data-id':id});
                $('<div>', {class:'sk-description', html:item.description}).appendTo(itemBlock);
                var blocks = $('<div>', {class:'sk-info'});
                for (j in item.options) {
                    let subBlocks = $('<div>', {class:'sk-info__row'});
                    $('<div>', {class:'sk-info__header', html:labels[j]}).appendTo(subBlocks);
                    $('<div>', {class:'sk-info__text', html:item.options[j]}).appendTo(subBlocks);
                    $(subBlocks).appendTo(blocks);
                }
                $(blocks).appendTo(itemBlock);
                $(infoBlocks).append(itemBlock);
            }


            var contaner = $('<div>', {class:'sk-container'});
            var contanerLeft = $('<div>', {class:'sk-container-left'});


            $(contanerLeft).append($('<h2>', {class:'sk-header', html:opts.header}));


            $(infoBlocks).appendTo(contanerLeft);

            var dotsHTML = $('<ul>', {class:'sk-dots'});
            $('<li>',{class:'sk-arr-left'}).appendTo(dotsHTML);
            $(dots.join('')).appendTo(dotsHTML);
            $('<li>',{class:'sk-arr-right'}).appendTo(dotsHTML);
            $(dotsHTML).appendTo(contanerLeft);
            $(contanerLeft).appendTo(contaner);

            var contanerRight = $('<div>', {class:'sk-container-right'});

            var namesHtml = $('<ul>', {class:'sk-names'}).append(names.join(''));
            $(namesHtml).appendTo(contanerRight);
            var imagesHtml = $('<ul>',{class:'sk-images'}).append(images.join(''));
            $(imagesHtml).appendTo(contanerRight);

            $(contanerRight).appendTo(contaner);

            $(_this).append(contaner);
        }
        hideObjects();
        bindObjects();
    }
}());