(function () {
    'use strict';

    function initCollectionFaqs(section) {
        if (!section || section.dataset.initialized === 'true') {
            return;
        }

        section.dataset.initialized = 'true';

        const questions = section.querySelectorAll(
            '.collection-faqs__question-wrapper'
        );

        questions.forEach(function (question) {

            function toggleFaq() {
                const isExpanded =
                    question.getAttribute('aria-expanded') === 'true';

                question.setAttribute(
                    'aria-expanded',
                    String(!isExpanded)
                );

                const answerId =
                    question.getAttribute('aria-controls');

                const answer =
                    document.getElementById(answerId);

                if (answer) {
                    answer.setAttribute(
                        'aria-hidden',
                        String(isExpanded)
                    );
                }
            }


            question.addEventListener('click', toggleFaq);


            question.addEventListener('keydown', function (event) {

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {
                    event.preventDefault();

                    toggleFaq();
                }

            });

        });
    }


    function initAll() {
        document
            .querySelectorAll('.collection-faqs')
            .forEach(function (section) {
                initCollectionFaqs(section);
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
      Shopify Theme Editor
    */

    document.addEventListener(
        'shopify:section:load',
        function (event) {

            const section =
                event.target.querySelector(
                    '.collection-faqs'
                );

            if (section) {
                initCollectionFaqs(section);
            }

        }
    );


    document.addEventListener(
        'shopify:section:unload',
        function (event) {

            const section =
                event.target.querySelector(
                    '.collection-faqs'
                );

            if (section) {
                section.dataset.initialized = 'false';
            }

        }
    );

})();