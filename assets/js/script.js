"use strict";
window.currentImageId = null;
var $skSlider = {

    _this:this,
    labels:{
        city:'City:',
        area:'Apartment area:',
        time:'Repair time:',
        cost:'Repair Cost:',
    },
    template:{
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
    },
    defaults:{
        header:'Header sample',
        slides:[]
    },
    options: {},


    /**
     *  Wrapper for createElement
     *
     * @param tag
     * @param options
     * @returns {*}
     */
    makeElement:(tag,options) => {
        var key;
        var el = document.createElement(tag);
        if(options) {
            for(key in options) {
                switch (key) {
                    case 'class':
                        el.classList.add(options[key]);
                        break
                    case 'html':
                        var it = document.createTextNode(options[key])
                        el.appendChild(it);
                        break
                    default:
                        el.setAttribute('id', options[key]);
                        break
                }
            }
        }
        return el;
    },
    /**
     * Show selected slide by id
     * @param id
     */
    activeById: (id) => {
        if(String(id) !== String(window.currentImageId)) {
            window.currentImageId = id;

            $skSlider.hideByCondition('li.sk-block', id);
            $skSlider.hideByCondition('li.sk-images__item', id);

            $skSlider.activeByCondition('li.sk-dot', id);
            $skSlider.activeByCondition('li.sk-name', id);
        }
    },
    /**
     * Control behavior of arrow buttons
     * @param arrow
     * @returns {*}
     */
    getItemByArrow: (arrow) => {
        var names = [];
        var curIndex = -1;

        var i, id,  blocks = document.querySelectorAll('li.sk-block');
        for(i in blocks) {
            if(parseInt(i) == i) {
                let id = blocks[i].getAttribute('id');
                names.push(id);
                if(String(id) === String(window.currentImageId)){
                    curIndex = i;
                }
            }
        }

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
    },

    /**
     * Activate names and dots by id
     * @param elementsClass
     * @param id
     */
    activeByCondition: (elementsClass, id) => {
        var i, blocks = document.querySelectorAll(elementsClass);
        for(i in blocks) {
            if(parseInt(i) == i) {

                if((blocks[i].hasAttribute('id')
                        && String(blocks[i].getAttribute('id')) === String(id)) ||
                    ( blocks[i].hasAttribute('data-id')
                        && String(blocks[i].getAttribute('data-id')) === String(id)))  {
                    blocks[i].classList.add('active');
                } else {
                    blocks[i].classList.remove('active');
                }
            }
        }
    },
    /**
     * Show slide by id
     * @param elementsClass
     * @param id
     */
    hideByCondition: (elementsClass, id) => {
        var i, blocks = document.querySelectorAll(elementsClass);
        for(i in blocks) {

/*
            console.log(i);
            console.log(blocks[i]);
*/
            if(parseInt(i) == i) {
                if((blocks[i].hasAttribute('id')
                        && String(blocks[i].getAttribute('id')) === String(id)) ||
                    ( blocks[i].hasAttribute('data-id')
                        && String(blocks[i].getAttribute('data-id')) === String(id)))  {
                    blocks[i].style.display = 'block';
                } else {
                    blocks[i].style.display = 'none';
                }
            }
        }
    },
    hideNotFirstElement: (elementsClass) => {
        var i, blocks = document.querySelectorAll(elementsClass);
        for(i in blocks) {
            if(parseInt(i) == i && i > 0)  {
                blocks[i].style.display = 'none';
            }
        }
    },
    /**
     * Start function for hide other slides
     * @param id
     */
    hideObjects: (id) => {
        console.log('hide');
        $skSlider.hideNotFirstElement('li.sk-block')
        $skSlider.hideNotFirstElement('li.sk-images__item')

        var activeDot = document.querySelector('li.sk-dot');
        activeDot.classList.add('active');
        var activeName = document.querySelector('li.sk-name');
        activeName.classList.add('active');
        window.currentImageId = activeName.getAttribute('data-id');

    },
    bindElements: (elementsClass, callback) => {
        var i, blocks = document.querySelectorAll(elementsClass);
        for(i in blocks) {
            if(parseInt(i) == i) {
                blocks[i].addEventListener('click', callback);
            }
        }
    },
    /**
     * Binding events
     * @param id
     */
    bindObjects: (id) => {

        $skSlider.bindElements('li.sk-name > a', function (event){
            var id = event.target.parentNode.getAttribute('data-id');
            if(id){
                $skSlider.activeById(id);
            }
        });

        $skSlider.bindElements('li.sk-dot > a', function (event){
            console.log(event.target.parentNode);
            var id = event.target.parentNode.getAttribute('data-id');
            console.log(id);
            if(id) {
                $skSlider.activeById(id);
            }
        });


        $skSlider.bindElements('li.sk-arr-left', function (event){
            var id = $skSlider.getItemByArrow(-1);
            if(id) {
                $skSlider.activeById(id);
            }
        });

        $skSlider.bindElements('li.sk-arr-right', function (event){
            var id = $skSlider.getItemByArrow(1);
            if(id) {
                $skSlider.activeById(id);
            }
        });
    },

    /**
     * Logic create DOM and init process
     * @param rootElement
     * @param options
     */
    init:function(rootElement,options){
        var i, j, names = [], dots = [], images =[], itemBlock = {} ;

        $skSlider.options = {
            ...$skSlider.defaults,
            ...options
        };


        if($skSlider.options.slides.length > 0) {
            const infoBlocks =  $skSlider.makeElement('ul', {class:'sk-blocks'});
            for (i in $skSlider.options.slides) {
                let item = $skSlider.options.slides[i];
                let id = String(btoa(item.name)).replace('==','').replace('=','');
                names.push('<li class="sk-name" data-id="' + id + '"><a href="javascript:;">' + item.name + '</a></li>');
                dots.push('<li class="sk-dot" data-id="' + id + '"><a href="javascript:;" \>&bull;</a></li>');
                images.push('<li class="sk-images__item" data-id="' + id + '"><img src="' + item.image + '" class="sk-images__image"></li>');
                itemBlock = $skSlider.makeElement('li', {class:'sk-block', 'data-id':id});
                itemBlock.appendChild($skSlider.makeElement('div', {class:'sk-description', html:item.description}));
                var blocks = $skSlider.makeElement('div', {class:'sk-info'});
                for (j in item.options) {
                    let subBlocks = $skSlider.makeElement('div', {class:'sk-info__row'});
                    subBlocks.appendChild($skSlider.makeElement('div', {class:'sk-info__header', html:$skSlider.labels[j]}));
                    subBlocks.appendChild($skSlider.makeElement('div', {class:'sk-info__text', html:item.options[j]}));
                    blocks.appendChild(subBlocks)
                }
                itemBlock.appendChild(blocks);
                infoBlocks.appendChild(itemBlock)
            }


            var container = $skSlider.makeElement('div', {class:'sk-container'});

            var containerLeft = $skSlider.makeElement('div', {class:'sk-container-left'});

            containerLeft.appendChild($skSlider.makeElement('h2', {class:'sk-header', html:$skSlider.options.header}));
            containerLeft.appendChild(infoBlocks);

            var dotsHTML = $skSlider.makeElement('ul', {class:'sk-dots'});

            dotsHTML.innerHTML = dotsHTML.innerHTML =  dots.join('');
            dotsHTML.prepend($skSlider.makeElement('li', {class:'sk-arr-left'}));
            dotsHTML.append($skSlider.makeElement('li', {class:'sk-arr-right'}));

            containerLeft.appendChild(dotsHTML);
            container.appendChild(containerLeft);


            var containerRight = $skSlider.makeElement('div', {class:'sk-container-right'});

            var namesHtml = $skSlider.makeElement('ul', {class:'sk-names'});
            namesHtml.innerHTML = namesHtml.innerHTML + names.join('');

            containerRight.appendChild(namesHtml);

            var imagesHtml = $skSlider.makeElement('ul');
            imagesHtml.className = 'sk-images';
            imagesHtml.innerHTML = imagesHtml.innerHTML + images.join('');
            containerRight.appendChild(imagesHtml);
            container.appendChild(containerRight);
            rootElement.appendChild(container);
        }
        $skSlider.hideObjects();
        $skSlider.bindObjects();
    }
};

