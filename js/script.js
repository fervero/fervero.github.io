(function() {

    function initNavbar() {
        $collapse = $("#nav-collapse");
        $nav = $("header");
        $collapse
            .on('click', function() {
                $nav.toggleClass('nav_collapsed');
            })
            .on('keydown', function(e) {
                if(e.key==="Enter")
                    $(this).click();
            });
    }
    
    function initAccordion() {
        $(".accordion dd").hide();
        $(".accordion")
            .on('click', 'dt', function(e){
                $(this).next().slideToggle(150);
            })
        .on('keydown', 'dt', function(e) {
            if(e.key==="Enter")
                $(this).click();
        });
    }

    window.onload =  function() {
        initNavbar();
        initAccordion();
    }    
})();
