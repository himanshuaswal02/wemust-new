(function () {
    'use strict';

    function initWhyChooseWemust(section) {
        if (!section || section.dataset.initialized === 'true') {
            return;
        }

        section.dataset.initialized = 'true';

        const images = section.querySelectorAll(
            '.why-choose-wemust__image'
        );

        images.forEach(function (image) {
            if (image.complete) {
                image.classList.add('is-loaded');
                return;
            }

            image.addEventListener(
                'load',
                function () {
                    image.classList.add('is-loaded');
                },
                { once: true }
            );

            image.addEventListener(
                'error',
                function () {
                    image.classList.add('is-loaded');
                },
                { once: true }
            );
        });
    }


    function initAll() {
        document
            .querySelectorAll('.why-choose-wemust')
            .forEach(function (section) {
                initWhyChooseWemust(section);
            });
    }


    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initAll
        );
    } else {
        initAll();
    }


    /*
     * Shopify Theme Editor
     */

    document.addEventListener(
        'shopify:section:load',
        function (event) {
            const section = event.target.querySelector(
                '.why-choose-wemust'
            );

            if (section) {
                initWhyChooseWemust(section);
            }
        }
    );


    document.addEventListener(
        'shopify:section:unload',
        function (event) {
            const section = event.target.querySelector(
                '.why-choose-wemust'
            );

            if (section) {
                section.dataset.initialized = 'false';
            }
        }
    );

})();