/****  Variables Initiation  ****/
var doc = document;
var docEl = document.documentElement;
var $body = $('body');
var $sidebar = $('.sidebar');
var $sidebarFooter = $('.sidebar .sidebar-footer');
var $mainContent = $('.main-content');
var $pageContent = $('.page-content');
var $topbar = $('.topbar');
var $logopanel = $('.logopanel');
var $sidebarWidth = $(".sidebar").width();
var content = document.querySelector('.page-content');
var is_RTL = false;
var $loader = $('#preloader');
var docHeight = $(document).height();
var windowHeight = $(window).height();
var topbarWidth = $('.topbar').width();
var headerLeftWidth = $('.header-left').width();
var headerRightWidth = $('.header-right').width();
var start = delta = end = 0;

$.cookie.defaults.path = '/';

angular.module('bootModule', [])
    .factory('pluginsService', [function() {



        /* ==========================================================*/
        /* PLUGINS                                                   */
        /* ========================================================= */

        /**** Color Picker ****/
        function colorPicker() {
            if ($('.color-picker').length && $.fn.spectrum) {
                $('.color-picker').each(function() {
                    var current_palette = '';
                    if ($(this).data('palette')) {
                        current_palette = $(this).data('palette');
                    }
                    $(this).spectrum({
                        color: $(this).data('min') ? $(this).data('min') : "#D15ADE",
                        showInput: $(this).data('show-input') ? $(this).data('show-input') : false,
                        showPalette: $(this).data('show-palette') ? $(this).data('show-palette') : false,
                        showPaletteOnly: $(this).data('show-palette-only') ? $(this).data('show-palette-only') : false,
                        showAlpha: $(this).data('show-alpha') ? $(this).data('show-alpha') : false,
                        palette: $(this).data('palette') ? $(this).data('palette') : [
                            [current_palette]
                        ]
                    });
                    $(this).show();
                });
            }
        }

        /**** Numeric Stepper ****/
        function numericStepper() {
            if ($('.numeric-stepper').length && $.fn.TouchSpin) {
                $('.numeric-stepper').each(function() {
                    $(this).TouchSpin({
                        min: $(this).data('min') ? $(this).data('min') : 0,
                        max: $(this).data('max') ? $(this).data('max') : 100,
                        step: $(this).data('step') ? $(this).data('step') : 0.1,
                        decimals: $(this).data('decimals') ? $(this).data('decimals') : 0,
                        boostat: $(this).data('boostat') ? $(this).data('boostat') : 5,
                        maxboostedstep: $(this).data('maxboostedstep') ? $(this).data('maxboostedstep') : 10,
                        verticalbuttons: $(this).data('vertical') ? $(this).data('vertical') : false,
                        buttondown_class: $(this).data('btn-before') ? 'btn btn-' + $(this).data('btn-before') : 'btn btn-default',
                        buttonup_class: $(this).data('btn-after') ? 'btn btn-' + $(this).data('btn-after') : 'btn btn-default',
                    });
                });
            }
        }

        /**** Sortable Portlets ****/
        function sortablePortlets() {
            if ($('.portlets').length && $.fn.sortable) {
                $(".portlets").sortable({
                    connectWith: ".portlets",
                    handle: ".panel-header",
                    items: 'div.panel',
                    placeholder: "panel-placeholder",
                    opacity: 0.5,
                    dropOnEmpty: true,
                    forcePlaceholderSize: true,
                    receive: function(event, ui) {
                        $("body").trigger("resize");
                    }
                });
            }
        }



        /**** Nestable List ****/
        function nestable() {
            if ($('.nestable').length && $.fn.nestable) {
                $(".nestable").nestable();
            }
        }

        /**** Sortable Table ****/
        function sortableTable() {
            if ($('.sortable_table').length && $.fn.sortable) {
                $(".sortable_table").sortable({
                    itemPath: '> tbody',
                    itemSelector: 'tbody tr',
                    placeholder: '<tr class="placeholder"/>'
                });
            }
        }

        /****  Show Tooltip  ****/
        function showTooltip() {
            if ($('[data-rel="tooltip"]').length && $.fn.tooltip) {
                $('[data-rel="tooltip"]').tooltip();
            }
        }

        /****  Show Popover  ****/
        function popover() {
            if ($('[rel="popover"]').length && $.fn.popover) {
                $('[rel="popover"]').popover({
                    trigger: "hover"
                });
                $('[rel="popover_dark"]').popover({
                    template: '<div class="popover popover-dark"><div class="arrow"></div><h3 class="popover-title popover-title"></h3><div class="popover-content popover-content"></div></div>',
                    trigger: "hover"
                });
            }
        }

        /****  Table progress bar  ****/
        function progressBar() {
            if ($('.progress-bar').length && $.fn.progressbar) {
                $('.progress-bar').progressbar();
            }
        }

        /**** IOS Switch  ****/
        function iosSwitch() {
            if ($('.js-switch').length) {
                setTimeout(function() {
                    $('.js-switch').each(function() {
                        var colorOn = '#18A689';
                        var colorOff = '#DFDFDF';
                        if ($(this).data('color-on')) colorOn = $(this).data('color-on');
                        if ($(this).data('color-on')) colorOff = $(this).data('color-off');
                        if (colorOn == 'blue') colorOn = '#56A2D5';
                        if (colorOn == 'red') colorOn = '#C75757';
                        if (colorOn == 'yellow') colorOn = '#F3B228';
                        if (colorOn == 'green') colorOn = '#18A689';
                        if (colorOn == 'purple') colorOn = '#8227f1';
                        if (colorOn == 'dark') colorOn = '#292C35';
                        if (colorOff == 'blue') colorOff = '#56A2D5';
                        if (colorOff == 'red') colorOff = '#C75757';
                        if (colorOff == 'yellow') colorOff = '#F3B228';
                        if (colorOff == 'green') colorOff = '#18A689';
                        if (colorOff == 'purple') colorOff = '#8227f1';
                        if (colorOff == 'dark') colorOff = '#292C35';
                        var switchery = new Switchery(this, {
                            color: colorOn,
                            secondaryColor: colorOff
                        });
                    });
                }, 500);
            }
        }

        /* Manage Slider */
        function sliderIOS() {
            if ($('.slide-ios').length && $.fn.slider) {
                $('.slide-ios').each(function() {
                    $(this).sliderIOS();
                });
            }
        }

        /* Manage Range Slider */
        function rangeSlider() {
            if ($('.range-slider').length && $.fn.ionRangeSlider) {
                $('.range-slider').each(function() {
                    $(this).ionRangeSlider({
                        min: $(this).data('min') ? $(this).data('min') : 0,
                        max: $(this).data('max') ? $(this).data('max') : 5000,
                        hideMinMax: $(this).data('hideMinMax') ? $(this).data('hideMinMax') : false,
                        hideFromTo: $(this).data('hideFromTo') ? $(this).data('hideFromTo') : false,
                        to: $(this).data('to') ? $(this).data('to') : '',
                        step: $(this).data('step') ? $(this).data('step') : '',
                        type: $(this).data('type') ? $(this).data('type') : 'double',
                        prefix: $(this).data('prefix') ? $(this).data('prefix') : '',
                        postfix: $(this).data('postfix') ? $(this).data('postfix') : '',
                        maxPostfix: $(this).data('maxPostfix') ? $(this).data('maxPostfix') : '',
                        hasGrid: $(this).data('hasGrid') ? $(this).data('hasGrid') : false,
                    });
                });
            }
        }

        /* Button Loading State */
        function buttonLoader() {
            if ($('.ladda-button').length) {
                Ladda.bind('.ladda-button', {
                    timeout: 2000
                });
                // Bind progress buttons and simulate loading progress
                Ladda.bind('.progress-demo button', {
                    callback: function(instance) {
                        var progress = 0;
                        var interval = setInterval(function() {
                            progress = Math.min(progress + Math.random() * 0.1, 1);
                            instance.setProgress(progress);

                            if (progress === 1) {
                                instance.stop();
                                clearInterval(interval);
                            }
                        }, 100);
                    }
                });
            }
        }

        function inputSelect() {

            if ($.fn.select2) {
                setTimeout(function() {
                    $('select').each(function() {
                        function format(state) {
                            var state_id = state.id;
                            if (!state_id) return state.text; // optgroup
                            var res = state_id.split("-");
                            if (res[0] == 'image') {
                                if (res[2]) return "<img class='flag' src='../images/flags/" + res[1].toLowerCase() + "-" + res[2].toLowerCase() + ".png' style='width:27px;padding-right:10px;margin-top: -3px;'/>" + state.text;
                                else return "<img class='flag' src='../images/flags/" + res[1].toLowerCase() + ".png' style='width:27px;padding-right:10px;margin-top: -3px;'/>" + state.text;
                            } else {
                                return state.text;
                            }
                        }
                        $(this).select2({
                            formatResult: format,
                            formatSelection: format,
                            placeholder: $(this).data('placeholder') ? $(this).data('placeholder') : '',
                            allowClear: $(this).data('allowclear') ? $(this).data('allowclear') : true,
                            minimumInputLength: $(this).data('minimumInputLength') ? $(this).data('minimumInputLength') : -1,
                            minimumResultsForSearch: $(this).data('search') ? 1 : -1,
                            dropdownCssClass: $(this).data('style') ? 'form-white' : ''
                        });
                    });

                }, 200);

                /* Demo Select Loading Data */
                function repoFormatResult(repo) {
                    var markup = '<div class="row">' +
                        '<div class="col-md-2"><img class="img-responsive" src="' + repo.owner.avatar_url + '" /></div>' +
                        '<div class="col-md-10">' +
                        '<div class="row">' +
                        '<div class="col-md-6">' + repo.full_name + '</div>' +
                        '<div class="col-md-3"><i class="fa fa-code-fork"></i> ' + repo.forks_count + '</div>' +
                        '<div class="col-md-3"><i class="fa fa-star"></i> ' + repo.stargazers_count + '</div>' +
                        '</div>';
                    if (repo.description) {
                        markup += '<div>' + repo.description + '</div>';
                    }
                    markup += '</div></div>';
                    return markup;
                }

                function repoFormatSelection(repo) {
                    return repo.full_name;
                }

                if ($('#demo-loading-data').length) {
                    $("#demo-loading-data").select2({
                        placeholder: "Search for a repository",
                        minimumInputLength: 1,
                        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                            url: "https://api.github.com/search/repositories",
                            dataType: 'json',
                            quietMillis: 250,
                            data: function(term, page) {
                                return {
                                    q: term, // search term
                                };
                            },
                            results: function(data, page) { // parse the results into the format expected by Select2.
                                // since we are using custom formatting functions we do not need to alter the remote JSON data
                                return { results: data.items };
                            },
                            cache: true
                        },
                        initSelection: function(element, callback) {
                            // the input tag has a value attribute preloaded that points to a preselected repository's id
                            // this function resolves that id attribute to an object that select2 can render
                            // using its formatResult renderer - that way the repository name is shown preselected
                            var id = $(element).val();
                            if (id !== "") {
                                $.ajax("https://api.github.com/repositories/" + id, {
                                    dataType: "json"
                                }).done(function(data) { callback(data); });
                            }
                        },
                        formatResult: repoFormatResult, // omitted for brevity, see the source of this page
                        formatSelection: repoFormatSelection, // omitted for brevity, see the source of this page
                        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                        escapeMarkup: function(m) {
                                return m;
                            } // we do not want to escape markup since we are displaying html in results
                    });
                }
            }
        }

        function inputTags() {
            $('.select-tags').each(function() {
                $(this).tagsinput({
                    tagClass: 'label label-primary'

                });
            });

        }

        /****  Tables Responsive  ****/
        function tableResponsive() {
            setTimeout(function() {
                $('.table').each(function() {
                    window_width = $(window).width();
                    table_width = $(this).width();
                    content_width = $(this).parent().width();
                    if (table_width > content_width) {
                        $(this).parent().addClass('force-table-responsive');
                    } else {
                        $(this).parent().removeClass('force-table-responsive');
                    }
                });
            }, 200);
        }

        /****  Tables Dynamic  ****/
        function tableDynamic() {
            if ($('.table-dynamic').length && $.fn.dataTable) {
                $('.table-dynamic').each(function() {
                    var opt = {};
                    // Tools: export to Excel, CSV, PDF & Print
                    if ($(this).hasClass('table-tools')) {
                        opt.sDom = "<'row'<'col-md-6'f><'col-md-6'T>r>t<'row'<'col-md-6'i><'spcol-md-6an6'p>>",
                            opt.oTableTools = {
                                "sSwfPath": "../../../assets/global/plugins/datatables/swf/copy_csv_xls_pdf.swf",
                                "aButtons": ["csv", "xls", "pdf", "print"]
                            };
                    }
                    if ($(this).hasClass('no-header')) {
                        opt.bFilter = false;
                        opt.bLengthChange = false;
                    }
                    if ($(this).hasClass('no-footer')) {
                        opt.bInfo = false;
                        opt.bPaginate = false;
                    }
                    if ($(this).hasClass('filter-head')) {
                        $('.filter-head thead th').each(function() {
                            var title = $('.filter-head thead th').eq($(this).index()).text();
                            $(this).append('<input type="text" onclick="stopPropagation(event);" class="form-control" placeholder="Filter ' + title + '" />');
                        });
                        var table = $('.filter-head').DataTable();
                        $(".filter-head thead input").on('keyup change', function() {
                            table.column($(this).parent().index() + ':visible').search(this.value).draw();
                        });
                    }
                    if ($(this).hasClass('filter-footer')) {
                        $('.filter-footer tfoot th').each(function() {
                            var title = $('.filter-footer thead th').eq($(this).index()).text();
                            $(this).html('<input type="text" class="form-control" placeholder="Filter ' + title + '" />');
                        });
                        var table = $('.filter-footer').DataTable();
                        $(".filter-footer tfoot input").on('keyup change', function() {
                            table.column($(this).parent().index() + ':visible').search(this.value).draw();
                        });
                    }
                    if ($(this).hasClass('filter-select')) {
                        $(this).DataTable({
                            initComplete: function() {
                                var api = this.api();

                                api.columns().indexes().flatten().each(function(i) {
                                    var column = api.column(i);
                                    var select = $('<select class="form-control" data-placeholder="Select to filter"><option value=""></option></select>')
                                        .appendTo($(column.footer()).empty())
                                        .on('change', function() {
                                            var val = $(this).val();

                                            column
                                                .search(val ? '^' + val + '$' : '', true, false)
                                                .draw();
                                        });

                                    column.data().unique().sort().each(function(d, j) {
                                        select.append('<option value="' + d + '">' + d + '</option>')
                                    });
                                });
                            }
                        });
                    }
                    if (!$(this).hasClass('filter-head') && !$(this).hasClass('filter-footer') && !$(this).hasClass('filter-select')) {
                        var oTable = $(this).dataTable(opt);
                        oTable.fnDraw();
                    }

                });
            }
        }


        // Handles custom checkboxes & radios using jQuery iCheck plugin
        function handleiCheck() {

            if (!$().iCheck) return;
            $(':checkbox:not(.js-switch, .switch-input, .switch-iphone, .onoffswitch-checkbox, .ios-checkbox), :radio').each(function() {

                var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
                var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';

                if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                    $(this).iCheck({
                        checkboxClass: checkboxClass,
                        radioClass: radioClass,
                        insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                    });
                } else {
                    $(this).iCheck({
                        checkboxClass: checkboxClass,
                        radioClass: radioClass
                    });
                }
            });
        }


        /* Time picker */
        function timepicker() {
            $('.timepicker').each(function() {
                $(this).timepicker({
                    isRTL: $('body').hasClass('rtl') ? true : false,
                    timeFormat: $(this).attr('data-format', 'am-pm') ? 'hh:mm tt' : 'HH:mm'
                });
            });
        }

        /* Date picker */
        function datepicker() {
            $('.date-picker').each(function() {
                $(this).datepicker({
                    numberOfMonths: 1,
                    isRTL: $('body').hasClass('rtl') ? true : false,
                    prevText: '<i class="fa fa-angle-left"></i>',
                    nextText: '<i class="fa fa-angle-right"></i>',
                    showButtonPanel: false
                });
            });
        }

        /* Date picker */
        function bDatepicker() {
            $('.b-datepicker').each(function() {
                $(this).bootstrapDatepicker({
                    startView: $(this).data('view') ? $(this).data('view') : 0, // 0: month view , 1: year view, 2: multiple year view
                    language: $(this).data('lang') ? $(this).data('lang') : "en",
                    forceParse: $(this).data('parse') ? $(this).data('parse') : false,
                    daysOfWeekDisabled: $(this).data('day-disabled') ? $(this).data('day-disabled') : "", // Disable 1 or various day. For monday and thursday: 1,3
                    calendarWeeks: $(this).data('calendar-week') ? $(this).data('calendar-week') : false, // Display week number 
                    autoclose: $(this).data('autoclose') ? $(this).data('autoclose') : false,
                    todayHighlight: $(this).data('today-highlight') ? $(this).data('today-highlight') : true, // Highlight today date
                    toggleActive: $(this).data('toggle-active') ? $(this).data('toggle-active') : true, // Close other when open
                    multidate: $(this).data('multidate') ? $(this).data('multidate') : false, // Allow to select various days
                    orientation: $(this).data('orientation') ? $(this).data('orientation') : "auto", // Allow to select various days,
                    rtl: $('html').hasClass('rtl') ? true : false
                });
            });
        }



        function multiDatesPicker() {
            $('.multidatepicker').each(function() {
                $(this).multiDatesPicker({
                    dateFormat: 'yy-mm-dd',
                    minDate: new Date(),
                    maxDate: '+1y',
                    firstDay: 1,
                    showOtherMonths: true
                });
            });
        }

        function rating() {
            $('.rateit').each(function() {
                $(this).rateit({
                    readonly: $(this).data('readonly') ? $(this).data('readonly') : false, // Not editable, for example to show rating that already exist 
                    resetable: $(this).data('resetable') ? $(this).data('resetable') : false,
                    value: $(this).data('value') ? $(this).data('value') : 0, // Current value of rating
                    min: $(this).data('min') ? $(this).data('min') : 1, // Maximum of star
                    max: $(this).data('max') ? $(this).data('max') : 5, // Maximum of star
                    step: $(this).data('step') ? $(this).data('step') : 0.1
                });
                // Tooltip Option      
                if ($(this).data('tooltip')) {
                    var tooltipvalues = ['bad', 'poor', 'ok', 'good', 'super']; // You can change text here 
                    $(this).bind('over', function(event, value) { $(this).attr('title', tooltipvalues[value - 1]); });
                }
                // Confirmation before voting option      
                if ($(this).data('confirmation')) {
                    $(this).on('beforerated', function(e, value) {
                        value = value.toFixed(1);
                        if (!confirm('Are you sure you want to rate this item: ' + value + ' stars?')) {
                            e.preventDefault();
                        } else {
                            // We disable rating after voting. If you want to keep it enable, remove this part
                            $(this).rateit('readonly', true);
                        }
                    });
                }
                // Disable vote after rating
                if ($(this).data('disable-after')) {
                    $(this).bind('rated', function(event, value) {
                        $(this).rateit('readonly', true);
                    });
                }
                // Display rating value as text below
                if ($(this).parent().find('.rating-value')) {
                    $(this).bind('rated', function(event, value) {
                        if (value) value = value.toFixed(1);
                        $(this).parent().find('.rating-value').text('Your rating: ' + value);
                    });
                }
                // Display hover value as text below     
                if ($(this).parent().find('.hover-value')) {
                    $(this).bind('over', function(event, value) {
                        if (value) value = value.toFixed(1);
                        $(this).parent().find('.hover-value').text('Hover rating value: ' + value);
                    });
                }

            });
        }

        /* Date & Time picker */
        function datetimepicker() {
            if ($.fn.datetimepicker) {
                $('.datetimepicker').each(function() {
                    $(this).datetimepicker({
                        prevText: '<i class="fa fa-angle-left"></i>',
                        nextText: '<i class="fa fa-angle-right"></i>'
                    });
                });

                /* Inline Date & Time picker */
                $('.inline_datetimepicker').datetimepicker({
                    altFieldTimeOnly: false,
                    isRTL: is_RTL
                });
            }
        }


        /* Popup Images */
        function magnificPopup() {
            if ($('.magnific').length && $.fn.magnificPopup) {
                $('.magnific').magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true
                    },
                    removalDelay: 300,
                    mainClass: 'mfp-fade'
                });
            }
        }

        /****  Summernote Editor  ****/
        function editorSummernote() {
            if ($('.summernote').length && $.fn.summernote) {
                $('.summernote').each(function() {
                    $(this).summernote({
                        height: 300,
                        airMode: $(this).data('airmode') ? $(this).data('airmode') : false,
                        airPopover: [
                            ["style", ["style"]],
                            ['color', ['color']],
                            ['font', ['bold', 'underline', 'clear']],
                            ['para', ['ul', 'paragraph']],
                            ['table', ['table']],
                            ['insert', ['link', 'picture']]
                        ],
                        toolbar: [
                            ["style", ["style"]],
                            ["style", ["bold", "italic", "underline", "clear"]],
                            ["fontsize", ["fontsize"]],
                            ["color", ["color"]],
                            ["para", ["ul", "ol", "paragraph"]],
                            ["height", ["height"]],
                            ["table", ["table"]],
                            ['view', ['codeview']],
                        ]
                    });
                });
            }
        }

        /****  CKE Editor  ****/
        function editorCKE() {
            if ($('.cke-editor').length && $.fn.ckeditor) {
                $('.cke-editor').each(function() {
                    $(this).ckeditor();
                });
                // Turn off automatic editor creation first.
                CKEDITOR.disableAutoInline = true;
            }
        }


        function slider() {
            if ($('.slick').length && $.fn.slick) {
                $('.slick').each(function() {
                    $(this).slick({
                        accessibility: true, // Enables tabbing and arrow key navigation
                        adaptiveHeight: false,
                        arrows: $(this).data('arrows') ? $(this).data('arrows') : false, // Enable Next/Prev arrows
                        asNavFor: null,
                        prevArrow: '<button type="button" data-role="none" class="slick-prev">Previous</button>', // prev arrow
                        nextArrow: '<button type="button" data-role="none" class="slick-next">Next</button>', // next arrow
                        autoplay: $(this).attr('data-autoplay') ? $(this).attr('data-autoplay') : true, // Enables auto play of slides
                        autoplaySpeed: $(this).data('timing') ? $(this).data('timing') : 4000, // Auto play change interval
                        centerMode: $(this).data('center') ? $(this).data('center') : false, // Enables centered view with partial prev/next slides. 
                        centerPadding: '50px', // Side padding when in center mode. (px or %)
                        cssEase: 'ease', // CSS3 easing
                        dots: $(this).attr('data-dots') ? $(this).attr('data-dots') : true, // Current slide indicator dots
                        dotsClass: 'slick-dots', // Class for slide indicator dots container
                        draggable: true, // Enables desktop dragging
                        easing: 'linear', // animate() fallback easing
                        fade: $(this).data('fade') ? $(this).data('fade') : false, // Enables fade
                        focusOnSelect: false,
                        infinite: true, // Infinite looping
                        lazyLoad: 'ondemand', // Accepts 'ondemand' or 'progressive' for lazy load technique
                        onBeforeChange: null, // Before slide change callback
                        onAfterChange: null, // After slide change callback
                        onInit: null, // When Slick initializes for the first time callback
                        onReInit: null, // Every time Slick (re-)initializes callback
                        pauseOnHover: true, // Pauses autoplay on hover
                        pauseOnDotsHover: false, // Pauses autoplay when a dot is hovered
                        responsive: null, // Breakpoint triggered settings
                        rtl: $('body').hasClass('rtl') ? true : false, // Change the slider's direction to become right-to-left
                        slide: '.slide', // Slide element query
                        slidesToShow: $(this).data('num-slides') ? $(this).data('num-slides') : 1, // # of slides to show at a time
                        slidesToScroll: $(this).data('num-scroll') ? $(this).data('num-scroll') : 1, // # of slides to show at a time,
                        speed: 500, // Transition speed
                        swipe: true, // Enables touch swipe
                        swipeToSlide: false, // Swipe to slide irrespective of slidesToScroll
                        touchMove: true, // Enables slide moving with touch
                        touchThreshold: 5, // To advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider.
                        useCSS: true, // Enable/Disable CSS Transitions
                        variableWidth: $(this).data('variable-width') ? true : false, // Disables automatic slide width calculation
                        vertical: false, // Vertical slide direction
                        waitForAnimate: true // Ignores requests to advance the slide while animating
                    });
                });
            }
        }

        function formWizard() {

            if ($('.wizard').length && $.fn.stepFormWizard) {
                $('.wizard').each(function() {
                    $this = $(this);
                    if (!$(this).data('initiated')) {
                        $(this).stepFormWizard({
                            theme: $(this).data('style') ? $(this).data('style') : "circle",
                            showNav: $(this).data('nav') ? $(this).data('nav') : "top",
                            height: "auto",
                            rtl: $('body').hasClass('rtl') ? true : false,
                            onNext: function(i, wizard) {
                                if ($this.hasClass('wizard-validation')) {
                                    return $('form', wizard).parsley().validate('block' + i);
                                }
                            },
                            onFinish: function(i) {
                                if ($this.hasClass('wizard-validation')) {
                                    return $('form', wizard).parsley().validate();
                                }
                            }
                        })
                        $(this).data('initiated', true);
                    }
                });

                /* Fix issue only with tabs with Validation on error show */
                $('#validation .wizard .sf-btn').off('click');
                $('#validation .wizard .sf-btn').on('click', function() {
                    setTimeout(function() {
                        $(window).resize();
                        $(window).trigger('resize');
                    }, 50);
                });
            }
        }


        function formValidation() {
            if ($('.form-validation').length && $.fn.validate) {
                /* We add an addition rule to show you. Example : 4 + 8. You can other rules if you want */
                $.validator.methods.operation = function(value, element, param) {
                    return value == param;
                };
                $.validator.methods.customemail = function(value, element) {
                    return /^([-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4})+$/.test(value);
                };
                $('.form-validation').each(function() {
                    var formValidation = $(this).validate({
                        success: "valid",
                        submitHandler: function() { alert("Form is valid! We submit it") },
                        errorClass: "form-error",
                        validClass: "form-success",
                        errorElement: "div",
                        ignore: [],
                        rules: {
                            avatar: { extension: "jpg|png|gif|jpeg|doc|docx|pdf|xls|rar|zip" },
                            password2: { equalTo: '#password' },
                            calcul: { operation: 12 },
                            url: { url: true },
                            email: {
                                required: {
                                    depends: function() {
                                        $(this).val($.trim($(this).val()));
                                        return true;
                                    }
                                },
                                customemail: true
                            },
                        },
                        messages: {
                            name: { required: 'Enter your name' },
                            lastname: { required: 'Enter your last name' },
                            firstname: { required: 'Enter your first name' },
                            email: { required: 'Enter email address', customemail: 'Enter a valid email address' },
                            language: { required: 'Enter your language' },
                            mobile: { required: 'Enter your phone number' },
                            avatar: { required: 'You must upload your avatar' },
                            password: { required: 'Write your password' },
                            password2: { required: 'Write your password', equalTo: '2 passwords must be the same' },
                            calcul: { required: 'Enter the result of 4 + 8', operation: 'Result is false. Try again!' },
                            terms: { required: 'You must agree with terms' }
                        },
                        highlight: function(element, errorClass, validClass) {
                            $(element).closest('.form-control').addClass(errorClass).removeClass(validClass);
                        },
                        unhighlight: function(element, errorClass, validClass) {
                            $(element).closest('.form-control').removeClass(errorClass).addClass(validClass);
                        },
                        errorPlacement: function(error, element) {
                            if (element.hasClass("custom-file") || element.hasClass("checkbox-type") || element.hasClass("language")) {
                                element.closest('.option-group').after(error);
                            } else if (element.is(":radio") || element.is(":checkbox")) {
                                element.closest('.option-group').after(error);
                            } else if (element.parent().hasClass('input-group')) {
                                element.parent().after(error);
                            } else {
                                error.insertAfter(element);
                            }
                        },
                        invalidHandler: function(event, validator) {
                            var errors = validator.numberOfInvalids();
                        }
                    });
                    $(".form-validation .cancel").click(function() {
                        formValidation.resetForm();
                    });
                });
            }
        }

        /****  Animated Panels  ****/
        function liveTile() {

            if ($('.live-tile').length && $.fn.liveTile) {
                $('.live-tile').each(function() {
                    $(this).liveTile("destroy", true); /* To get new size if resize event */
                    tile_height = $(this).data("height") ? $(this).data("height") : $(this).find('.panel-body').height() + 52;
                    $(this).height(tile_height);
                    $(this).liveTile({
                        speed: $(this).data("speed") ? $(this).data("speed") : 500, // Start after load or not
                        mode: $(this).data("animation-easing") ? $(this).data("animation-easing") : 'carousel', // Animation type: carousel, slide, fade, flip, none
                        playOnHover: $(this).data("play-hover") ? $(this).data("play-hover") : false, // Play live tile on hover
                        repeatCount: $(this).data("repeat-count") ? $(this).data("repeat-count") : -1, // Repeat or not (-1 is infinite
                        delay: $(this).data("delay") ? $(this).data("delay") : 0, // Time between two animations
                        startNow: $(this).data("start-now") ? $(this).data("start-now") : true, //Start after load or not
                    });
                });
            }
        }

        /**** Bar Charts: CHARTJS ****/
        function barCharts() {
            if ($('.bar-stats').length) {
                $('.bar-stats').each(function() {
                    var randomScalingFactor = function() {
                        return Math.round(Math.random() * 100)
                    };
                    var custom_colors = ['#C9625F', '#18A689', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#8085e8', '#91e8e1'];
                    var custom_color = custom_colors[Math.floor(Math.random() * custom_colors.length)];
                    var barChartData = {
                        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                        datasets: [{
                            fillColor: custom_color,
                            strokeColor: custom_color,
                            highlightFill: "#394248",
                            highlightStroke: "#394248",
                            data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
                        }]
                    }
                    var ctx = $(this).get(0).getContext("2d");
                    window.myBar = new Chart(ctx).Bar(barChartData, {
                        responsive: true,
                        scaleShowLabels: false,
                        showScale: true,
                        scaleLineColor: "rgba(0,0,0,.1)",
                        scaleShowGridLines: false,
                    });
                });
            }
        }

        function animateNumber() {
            $('.countup').each(function() {
                from = $(this).data("from") ? $(this).data("from") : 0;
                to = $(this).data("to") ? $(this).data("to") : 100;
                duration = $(this).data("duration") ? $(this).data("duration") : 2;
                delay = $(this).data("delay") ? $(this).data("delay") : 1000;
                decimals = $(this).data("decimals") ? $(this).data("decimals") : 0;
                var options = {
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    prefix: $(this).data("prefix") ? $(this).data("  prefix") : '',
                    suffix: $(this).data("suffix") ? $(this).data("suffix") : ''
                }
                var numAnim = new countUp($(this).get(0), from, to, decimals, duration, options);
                setTimeout(function() {
                    numAnim.start();
                }, delay);
            });
        }

        function textareaAutosize() {
            $('textarea.autosize').each(function() {
                $(this).autosize();
            });
        }

        /****  On Resize Functions  ****/
        $(window).bind('resize', function(e) {
            window.resizeEvt;
            $(window).resize(function() {
                clearTimeout(window.resizeEvt);
                window.resizeEvt = setTimeout(function() {
                    tableResponsive();
                }, 250);
            });
        });

        return {
            inputSelect: inputSelect,
            sortablePortlets: sortablePortlets,
            init: function() {
                /****  Variables Initiation  ****/
                var doc = document;
                var docEl = document.documentElement;
                var $sidebar = $('.sidebar');
                var $mainContent = $('.main-content');
                var $sidebarWidth = $(".sidebar").width();
                var is_RTL = false;

                if ($('body').hasClass('rtl')) is_RTL = true;

                var oldIndex;
                if ($('.sortable').length && $.fn.sortable) {
                    $(".sortable").sortable({
                        handle: ".panel-header",
                        start: function(event, ui) {
                            oldIndex = ui.item.index();
                            ui.placeholder.height(ui.item.height() - 20);
                        },
                        stop: function(event, ui) {
                            var newIndex = ui.item.index();

                            var movingForward = newIndex > oldIndex;
                            var nextIndex = newIndex + (movingForward ? -1 : 1);

                            var items = $('.sortable > div');

                            // Find the element to move
                            var itemToMove = items.get(nextIndex);
                            if (itemToMove) {

                                // Find the element at the index where we want to move the itemToMove
                                var newLocation = $(items.get(oldIndex));

                                // Decide if it goes before or after
                                if (movingForward) {
                                    $(itemToMove).insertBefore(newLocation);
                                } else {
                                    $(itemToMove).insertAfter(newLocation);
                                }
                            }
                        }
                    });
                }

                sortablePortlets();
                sortableTable();
                nestable();
                showTooltip();
                popover();
                colorPicker();
                numericStepper();
                iosSwitch();
                sliderIOS();
                rangeSlider();
                buttonLoader();
                inputSelect();
                inputTags();
                tableResponsive();
                tableDynamic();
                handleiCheck();
                timepicker();
                datepicker();
                bDatepicker();
                multiDatesPicker();
                datetimepicker();
                rating();
                magnificPopup();
                editorSummernote();
                editorCKE();
                slider();
                liveTile();
                formWizard();
                formValidation();
                barCharts();
                animateNumber();
                textareaAutosize();
            }
        }

    }]).factory('applicationService', ['$resource', 'pluginsService', function($resource, pluginsService) {

        // $(window).load(function() {
        //     "use strict";
        //     setTimeout(function() {
        //         $('.loader-overlay').addClass('loaded');
        //         $('body > section').animate({
        //             opacity: 1,
        //         }, 400);
        //     }, 500);
        // });


        /* ==========================================================*/
        /* LAYOUTS API                                                */
        /* ========================================================= */
        /* Create RTL: Sidebar on Right Side */
        function enableRTL() {
            $('#switch-rtl').prop('checked', true);
            $('body').removeClass('rtl').addClass('rtl');
            $('html').removeClass('rtl').addClass('rtl');
            $('.sidebar').css('width', '');
            $('.sidebar .searchform input').css('width', '');
            $('.sidebar .sidebar-footer').css('width', '');
            $('.logopanel').css('width', '');
            $('.searchform input').css('width', '');
            $('.sidebar .sidebar-footer .pull-left').css('');
            $('.main-content').css('margin-left', '');
            $('.topbar').css('left', '');
            if ($('body').hasClass('sidebar-hover')) sidebarHover();
            $('#switch-rtl').prop('checked', true);
            handleboxedLayout();
            $.cookie('rtl', 1, { path: '/' });
        }

        /* Remove RTL: Sidebar on Left Side */
        function disableRTL() {
            $('#switch-rtl').prop('checked', false);
            $('html').removeClass('rtl');
            $('body').removeClass('rtl');
            $('.sidebar').css('width', '');
            $('.sidebar').css('left', '');
            $('.sidebar .searchform input').css('width', '');
            $('.sidebar .sidebar-footer').css('width', '');
            $('.logopanel').css('width', '');
            $('.searchform input').css('width', '');
            $('.sidebar .sidebar-footer .pull-left').css('');
            $('.main-content').css('margin-right', '');
            $('.topbar').css('right', '');
            if ($('body').hasClass('sidebar-hover')) sidebarHover();
            handleboxedLayout();
            $.removeCookie('rtl', { path: '/' });
        }

        /* Toggle RTL */
        function toggleRTL() {
            if ($('html').hasClass('rtl')) disableRTL();
            else enableRTL();
        }

        /* Create Sidebar Fixed */
        function handleSidebarFixed() {
            // removeSidebarHover();
            $('#switch-sidebar').prop('checked', true);
            $('#switch-submenu').prop('checked', false);
            $.removeCookie('submenu-hover');
            if ($('body').hasClass('sidebar-top')) {
                $('body').removeClass('fixed-topbar').addClass('fixed-topbar');
                $.removeCookie('fluid-topbar');
                $('#switch-topbar').prop('checked', true);
            }
            $('body').removeClass('fixed-sidebar').addClass('fixed-sidebar');
            $('.sidebar').height('');
            handleboxedLayout();
            if (!$('body').hasClass('sidebar-collapsed')) removeSubmenuHover();
            createSideScroll();
            $.removeCookie('fluid-sidebar', { path: '/' });
            $.cookie('fixed-sidebar', 1, { path: '/' });
        }

        /* Create Sidebar Fluid / Remove Sidebar Fixed */
        function handleSidebarFluid() {
            $('#switch-sidebar').prop('checked', false);
            if ($('body').hasClass('sidebar-hover')) {
                removeSidebarHover();
                $('#switch-sidebar-hover').prop('checked', false);
            }
            $('body').removeClass('fixed-sidebar');
            handleboxedLayout();
            destroySideScroll();
            $.removeCookie('fixed-sidebar', { path: '/' });
            $.cookie('fluid-sidebar', 1, { path: '/' });
        }

        /* Toggle Sidebar Fixed / Fluid */
        function toggleSidebar() {
            if ($('body').hasClass('fixed-sidebar')) handleSidebarFluid();
            else handleSidebarFixed();
        }

        /* Create Sidebar only visible on Hover */
        function createSidebarHover() {
            $('body').addClass('sidebar-hover');
            $('body').removeClass('fixed-sidebar').addClass('fixed-sidebar');
            $('.main-content').css('margin-left', '').css('margin-right', '');
            $('.topbar').css('left', '').css('right', '');
            $('body').removeClass('sidebar-top');
            removeSubmenuHover();
            removeBoxedLayout();
            removeCollapsedSidebar();
            sidebarHover();
            handleSidebarFixed();
            $('#switch-sidebar-hover').prop('checked', true);
            $('#switch-sidebar').prop('checked', true);
            $('#switch-sidebar-top').prop('checked', false);
            $('#switch-boxed').prop('checked', false);
            $.removeCookie('fluid-topbar');
            $.removeCookie('fluid-topbar', { path: '/' });
            $.removeCookie('sidebar-top', { path: '/' });
            $.cookie('sidebar-hover', 1, { path: '/' });
        }

        /* Remove Sidebar on Hover */
        function removeSidebarHover() {
            $('#switch-sidebar-hover').prop('checked', false);
            $('body').removeClass('sidebar-hover');
            if (!$('body').hasClass('boxed')) $('.sidebar, .sidebar-footer').attr('style', '');
            $('.logopanel2').remove();
            $.removeCookie('sidebar-hover', { path: '/' });
        }

        /* Toggle Sidebar on Top */
        function toggleSidebarHover() {
            if ($('body').hasClass('sidebar-hover')) removeSidebarHover();
            else createSidebarHover();
        }

        /* Create Sidebar Submenu visible on Hover */
        function createSubmenuHover() {
            removeSidebarHover();
            handleSidebarFluid();
            $('#switch-submenu-hover').prop('checked', true);
            $('body').addClass('submenu-hover');
            $('.nav-sidebar .children').css('display', '');
            $.cookie('submenu-hover', 1, { path: '/' });
            $('#switch-sidebar').prop('checked', false);
        }

        /* Remove Submenu on Hover */
        function removeSubmenuHover() {
            $('#switch-submenu-hover').prop('checked', false);
            $('body').removeClass('submenu-hover');
            $('.nav-sidebar .nav-parent.active .children').css('display', 'block');
            $.removeCookie('submenu-hover', { path: '/' });
        }

        /* Toggle Submenu on Hover */
        function toggleSubmenuHover() {
            if ($('body').hasClass('submenu-hover')) removeSubmenuHover();
            else createSubmenuHover();
        }

        /* Create Topbar Fixed */
        function handleTopbarFixed() {
            $('#switch-topbar').prop('checked', true);
            $('body').removeClass('fixed-topbar').addClass('fixed-topbar');
            $.removeCookie('fluid-topbar');
            $.removeCookie('fluid-topbar', { path: '/' });
        }

        /* Create Topbar Fluid / Remove Topbar Fixed */
        function handleTopbarFluid() {
            $('#switch-topbar').prop('checked', false);
            $('body').removeClass('fixed-topbar');
            if ($('body').hasClass('sidebar-top') && $('body').hasClass('fixed-sidebar')) {
                $('body').removeClass('fixed-sidebar');
                $('#switch-sidebar').prop('checked', false);
            }
            $.cookie('fluid-topbar', 1, { path: '/' });
        }

        /* Toggle Topbar Fixed / Fluid */
        function toggleTopbar() {
            if ($('body').hasClass('fixed-topbar')) handleTopbarFluid();
            else handleTopbarFixed();
        }

        /* Adjust margin of content for boxed layout */
        function handleboxedLayout() {
            if ($('body').hasClass('builder-admin')) return;
            $logopanel.css('left', '').css('right', '');
            $topbar.css('width', '');
            $sidebar.css('margin-left', '').css('margin-right', '');
            $sidebarFooter.css('left', '').css('right', '');
            if ($('body').hasClass('boxed')) {
                windowWidth = $(window).width();
                windowHeight = $(window).height();
                pageContentHeight = $('.page-content').height();
                var container = 1200;
                topbarWidth = (container - $sidebarWidth);
                var margin = (windowWidth - 1200) / 2;
                if (!$('body').hasClass('sidebar-top') && windowWidth > 1220) {
                    if ($('body').hasClass('rtl')) {
                        $logopanel.css('right', margin);
                        if ($('body').hasClass('sidebar-collapsed')) {
                            $topbar.css('width', 1200);
                        } else {
                            if ($('body').hasClass('fixed-sidebar')) {
                                $sidebar.css('margin-right', margin);
                                topbarWidth = (1200 - $sidebarWidth);
                                $('.topbar').css('width', topbarWidth);
                            }
                            $sidebarFooter.css('right', margin);
                            $topbar.css('width', topbarWidth);
                        }
                    } else {
                        $logopanel.css('left', margin);
                        if ($('body').hasClass('sidebar-collapsed')) {
                            $topbar.css('width', 1200);
                        } else {
                            if ($('body').hasClass('fixed-sidebar')) {
                                $sidebar.css('margin-left', margin);
                                topbarWidth = (1200 - $sidebarWidth);
                                $('.topbar').css('width', topbarWidth);
                            }
                            $sidebarFooter.css('left', margin);
                            $topbar.css('width', topbarWidth);

                        }
                    }

                    $.backstretch(["../../../assets/global/images/gallery/bg1.jpg", "../../../assets/global/images/gallery/bg2.jpg", "../../../assets/global/images/gallery/bg3.jpg", "../../../assets/global/images/gallery/bg4.jpg"], {
                        fade: 3000,
                        duration: 4000
                    });
                } else {
                    $('.backstretch').remove();
                }

            }
        }

        /* Create Boxed Layout */
        function createBoxedLayout() {
            removeSidebarHover();
            $('body').addClass('boxed');
            handleboxedLayout();
            $('#switch-boxed').prop('checked', true);
            $.cookie('boxed-layout', 1, { path: '/' });
        }

        /* Remove boxed layout */
        function removeBoxedLayout() {
            if ($('body').hasClass('boxed')) {
                $('body').removeClass('boxed');
                $logopanel.css('left', '').css('right', '');
                $topbar.css('width', '');
                $sidebar.css('margin-left', '').css('margin-right', '');
                $sidebarFooter.css('left', '').css('right', '');
                $.removeCookie('boxed-layout', { path: '/' });
                $('#switch-boxed').prop('checked', false);
                $.backstretch("destroy");
            }
        }

        function toggleboxedLayout() {
            if ($('body').hasClass('boxed')) removeBoxedLayout();
            else createBoxedLayout();
        }

        /* Toggle Sidebar Collapsed */
        function collapsedSidebar() {
            if ($body.css('position') != 'relative') {
                if (!$body.hasClass('sidebar-collapsed')) createCollapsedSidebar();
                else removeCollapsedSidebar();
            } else {
                if ($body.hasClass('sidebar-show')) $body.removeClass('sidebar-show');
                else $body.addClass('sidebar-show');
            }
            handleboxedLayout();
        }

        function createCollapsedSidebar() {
            $body.addClass('sidebar-collapsed');
            // $('.sidebar').css('width', '').resizable().resizable('destroy');
            $('.nav-sidebar ul').attr('style', '');
            $(this).addClass('menu-collapsed');
            destroySideScroll();
            $('#switch-sidebar').prop('checked');
            $.cookie('sidebar-collapsed', 1, { path: '/' });
        }

        function removeCollapsedSidebar() {
            $body.removeClass('sidebar-collapsed');
            if (!$body.hasClass('submenu-hover'))
                $('.nav-sidebar li.active ul').css({
                    display: 'block'
                });
            $(this).removeClass('menu-collapsed');
            if ($body.hasClass('sidebar-light') && !$body.hasClass('sidebar-fixed')) {
                $('.sidebar').height('');
            }
            createSideScroll();
            $.removeCookie('sidebar-collapsed', { path: '/' });
        }



        /* Reset to Default Style, remove all cookie and custom layouts */
        function resetStyle() {
            $('#reset-style').off('click');
            $('#reset-style').on('click', function(event) {
                event.preventDefault();
                removeBoxedLayout();
                removeSidebarHover();
                removeSubmenuHover();
                removeCollapsedSidebar();
                disableRTL();
                $.removeCookie('rtl');
                $.removeCookie('main-color');
                $.removeCookie('main-name');
                $.removeCookie('theme');
                $.removeCookie('bg-name');
                $.removeCookie('bg-color');
                $.removeCookie('submenu-hover');
                $.removeCookie('sidebar-collapsed');
                $.removeCookie('boxed-layout');
                $.removeCookie('boxed-layout', { path: '/' });
                $.removeCookie('rtl', { path: '/' });
                $.removeCookie('main-color', { path: '/' });
                $.removeCookie('main-name', { path: '/' });
                $.removeCookie('theme', { path: '/' });
                $.removeCookie('bg-name', { path: '/' });
                $.removeCookie('bg-color', { path: '/' });
                $.removeCookie('submenu-hover', { path: '/' });
                $.removeCookie('sidebar-collapsed', { path: '/' });
                $('body').removeClass(function(index, css) {
                    return (css.match(/(^|\s)bg-\S+/g) || []).join(' ');
                });
                $('body').removeClass(function(index, css) {
                    return (css.match(/(^|\s)color-\S+/g) || []).join(' ');
                });
                $('body').removeClass(function(index, css) {
                    return (css.match(/(^|\s)theme-\S+/g) || []).join(' ');
                });
                $('body').addClass('theme-sdtl').addClass('color-default');
                $('.builder .theme-color').removeClass('active');
                $('.theme-color').each(function() {
                    if ($(this).data('color') == '#319DB5') $(this).addClass('active');
                });
                $('.builder .theme').removeClass('active');
                $('.builder .theme-default').addClass('active');
                $('.builder .sp-replacer').removeClass('active');
            });
        }


        /******************** END LAYOUT API  ************************/
        /* ========================================================= */
        /****  Full Screen Toggle  ****/
        function toggleFullScreen() {
            if (!doc.fullscreenElement && !doc.msFullscreenElement && !doc.webkitIsFullScreen && !doc.mozFullScreenElement) {
                if (docEl.requestFullscreen) {
                    docEl.requestFullscreen();
                } else if (docEl.webkitRequestFullScreen) {
                    docEl.webkitRequestFullscreen();
                } else if (docEl.webkitRequestFullScreen) {
                    docEl.webkitRequestFullScreen();
                } else if (docEl.msRequestFullscreen) {
                    docEl.msRequestFullscreen();
                } else if (docEl.mozRequestFullScreen) {
                    docEl.mozRequestFullScreen();
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                } else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                }
            }
        }



        /* Simulate Ajax call on Panel with reload effect */
        function blockUI(item) {
            $(item).block({
                message: '<svg class="circular"><circle class="path" cx="40" cy="40" r="10" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>',
                css: {
                    border: 'none',
                    width: '14px',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.6,
                    cursor: 'wait'
                }
            });
        }

        function unblockUI(item) {
            $(item).unblock();
        }

        /**** PANEL ACTIONS ****/
        /* Create Portlets Controls automatically: reload, fullscreen, toggle, remove, popout */
        function handlePanelControls() {
            $('.panel-controls').each(function() {
                var controls_html = '<div class="control-btn">' + '<a href="#" class="panel-reload hidden"><i class="icon-reload"></i></a>' + '<a class="hidden" id="dropdownMenu1" data-toggle="dropdown">' + '<i class="icon-settings"></i>' + '</a>' + '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenu1">' + '<li><a href="#">Action</a>' + '</li>' + '<li><a href="#">Another action</a>' + '</li>' + '<li><a href="#">Something else here</a>' + '</li>' + '</ul>' + '<a href="#" class="panel-popout hidden tt" title="Pop Out/In"><i class="icons-office-58"></i></a>' + '<a href="#" class="panel-maximize hidden"><i class="icon-size-fullscreen"></i></a>' + '<a href="#" class="panel-toggle"><i class="fa fa-angle-down"></i></a>' + '<a href="#" class="panel-close"><i class="icon-trash"></i></a>' + '</div>';
                $(this).append(controls_html);
            });
        }

        function handlePanelAction() {

            handlePanelControls();
            // Remove Panel 
            $(".panel-header .panel-close").click(function(event) {
                event.preventDefault();
                $item = $(this).parents(".panel:first");
                bootbox.confirm("Are you sure to remove this panel?", function(result) {
                    if (result === true) {
                        $item.addClass("animated bounceOutRight");
                        window.setTimeout(function() {
                            $item.remove();
                        }, 300);
                    }
                });
            });
            // Toggle Panel Content
            $(".panel-header .panel-toggle").click(function(event) {
                event.preventDefault();
                $(this).toggleClass("closed").parents(".panel:first").find(".panel-content").slideToggle();
            });
            // Popout / Popin Panel
            $(".panel-header .panel-popout").click(function(event) {
                event.preventDefault();
                var panel = $(this).parents(".panel:first");
                if (panel.hasClass("modal-panel")) {
                    $("i", this).removeClass("icons-office-55").addClass("icons-office-58");
                    panel.removeAttr("style").removeClass("modal-panel");
                    panel.find(".panel-maximize,.panel-toggle").removeClass("nevershow");
                    panel.draggable("destroy").resizable("destroy");
                } else {
                    panel.removeClass("maximized");
                    panel.find(".panel-maximize,.panel-toggle").addClass("nevershow");
                    $("i", this).removeClass("icons-office-58").addClass("icons-office-55");
                    var w = panel.width();
                    var h = panel.height();
                    panel.addClass("modal-panel").removeAttr("style").width(w).height(h);
                    $(panel).draggable({
                        handle: ".panel-header",
                        containment: ".page-content"
                    }).css({
                        "left": panel.position().left - 10,
                        "top": panel.position().top + 2
                    }).resizable({
                        minHeight: 150,
                        minWidth: 200
                    });
                }
                window.setTimeout(function() {
                    $("body").trigger("resize");
                }, 300);
            });
            // Reload Panel Content
            $('.panel-header .panel-reload').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                var el = $(this).parents(".panel:first");
                blockUI(el);
                window.setTimeout(function() {
                    unblockUI(el);
                }, 1800);
            });
            // Maximize Panel Dimension 
            $(".panel-header .panel-maximize").click(function(event) {
                event.preventDefault();
                var panel = $(this).parents(".panel:first");
                $body.toggleClass("maximized-panel");
                panel.removeAttr("style").toggleClass("maximized");
                maximizePanel();
                if (panel.hasClass("maximized")) {
                    panel.parents(".portlets:first").sortable("destroy");
                    $(window).trigger('resize');
                } else {
                    $(window).trigger('resize');
                    panel.parent().height('');
                    pluginsService.sortablePortlets();
                }
                $("i", this).toggleClass("icon-size-fullscreen").toggleClass("icon-size-actual");
                panel.find(".panel-toggle").toggleClass("nevershow");
                $("body").trigger("resize");
                return false;
            });
        }

        function maximizePanel() {
            if ($('.maximized').length) {
                var panel = $('.maximized');
                var windowHeight = $(window).height() - 2;
                panelHeight = panel.find('.panel-header').height() + panel.find('.panel-content').height() + 100;
                if (panel.hasClass('maximized')) {
                    if (windowHeight > panelHeight) panel.parent().height(windowHeight);
                    else {
                        if ($('.main-content').height() > panelHeight) {
                            panel.parent().height($('.main-content').height());
                        } else {
                            panel.parent().height(panelHeight);
                        }
                    }
                } else {
                    panel.parent().height('');
                }
            }
        }


        /****  Custom Scrollbar  ****/
        /* Create Custom Scroll for elements like Portlets or Dropdown menu */
        function customScroll() {
            if ($.fn.mCustomScrollbar) {
                $('.withScroll').each(function() {
                    $(this).mCustomScrollbar("destroy");
                    var scroll_height = $(this).data('height') ? $(this).data('height') : 'auto';
                    var data_padding = $(this).data('padding') ? $(this).data('padding') : 0;
                    if ($(this).data('height') == 'window') {
                        thisHeight = $(this).height();
                        windowHeight = $(window).height() - data_padding - 50;
                        if (thisHeight < windowHeight) scroll_height = thisHeight;
                        else scroll_height = windowHeight;
                    }
                    $(this).mCustomScrollbar({
                        scrollButtons: {
                            enable: false
                        },
                        autoHideScrollbar: $(this).hasClass('show-scroll') ? false : true,
                        scrollInertia: 150,
                        theme: "light",
                        set_height: scroll_height,
                        advanced: {
                            updateOnContentResize: true
                        }
                    });
                });
            }
        }

        /* ==========================================================*/
        /* BEGIN SIDEBAR                                             */
        /* Sidebar Sortable menu & submenu */
        function handleSidebarSortable() {
            $('.menu-settings').off('click', '#reorder-menu');
            $('.menu-settings').on('click', '#reorder-menu', function(e) {
                e.preventDefault();
                $('.nav-sidebar').removeClass('remove-menu');
                $(".nav-sidebar").sortable({
                    connectWith: ".nav-sidebar > li",
                    handle: "a",
                    placeholder: "nav-sidebar-placeholder",
                    opacity: 0.5,
                    axis: "y",
                    dropOnEmpty: true,
                    forcePlaceholderSize: true,
                    receive: function(event, ui) {
                        $("body").trigger("resize")
                    }
                });
                /* Sortable children */
                $(".nav-sidebar .children").sortable({
                    connectWith: "li",
                    handle: "a",
                    opacity: 0.5,
                    dropOnEmpty: true,
                    forcePlaceholderSize: true,
                    receive: function(event, ui) {
                        $("body").trigger("resize")
                    }
                });
                $(this).attr("id", "end-reorder-menu");
                $(this).html('End reorder menu');
                $('.remove-menu').attr("id", "remove-menu").html('Remove menu');
            });
            /* End Sortable Menu Elements*/
            $('.menu-settings').off('click', '#end-reorder-menu');
            $('.menu-settings').on('click', '#end-reorder-menu', function(e) {
                e.preventDefault();
                $(".nav-sidebar").sortable();
                $(".nav-sidebar").sortable("destroy");
                $(".nav-sidebar .children").sortable().sortable("destroy");
                $(this).attr("id", "remove-menu").html('Reorder menu');
            });
        }

        /* Sidebar Remove Menu Elements*/
        function handleSidebarRemove() {
            /* Remove Menu Elements*/
            $('.menu-settings').off('click', '#remove-menu');
            $('.menu-settings').on('click', '#remove-menu', function(e) {
                e.preventDefault();
                $(".nav-sidebar").sortable();
                $(".nav-sidebar").sortable("destroy");
                $(".nav-sidebar .children").sortable().sortable("destroy");
                $('.nav-sidebar').removeClass('remove-menu').addClass('remove-menu');
                $(this).attr("id", "end-remove-menu").html('End remove menu');
                $('.reorder-menu').attr("id", "reorder-menu").html('Reorder menu');
            });
            /* End Remove Menu Elements*/
            $('.menu-settings').off('click', '#end-remove-menu');
            $('.menu-settings').on('click', '#end-remove-menu', function(e) {
                e.preventDefault();
                $('.nav-sidebar').removeClass('remove-menu');
                $(this).attr("id", "remove-menu").html('Remove menu');
            });
            $('.sidebar').off('click', '.remove-menu > li');
            $('.sidebar').on('click', '.remove-menu > li', function() {
                $menu = $(this);
                if ($(this).hasClass('nav-parent')) $remove_txt = "Are you sure to remove this menu (all submenus will be deleted too)?";
                else $remove_txt = "Are you sure to remove this menu?";
                bootbox.confirm($remove_txt, function(result) {
                    if (result === true) {
                        $menu.addClass("animated bounceOutLeft");
                        window.setTimeout(function() {
                            $menu.remove();
                        }, 300);
                    }
                });
            });
        }

        /* Hide User & Search Sidebar */
        function handleSidebarHide() {
            hiddenElements = $(':hidden');
            visibleElements = $(':visible');
            $('.menu-settings').off('click', '#hide-top-sidebar');
            $('.menu-settings').on('click', '#hide-top-sidebar', function(e) {
                e.preventDefault();
                var this_text = $(this).text();
                $('.sidebar .sidebar-top').slideToggle(300);
                if (this_text == 'Hide user & search') {
                    $(this).text('Show user & search');
                }
            });
            $('.topbar').off('click', '.toggle-sidebar-top');
            $('.topbar').on('click', '.toggle-sidebar-top', function(e) {
                e.preventDefault();
                $('.sidebar .sidebar-top').slideToggle(300);
                if ($('.toggle-sidebar-top span').hasClass('icon-user-following')) {
                    $('.toggle-sidebar-top span').removeClass('icon-user-following').addClass('icon-user-unfollow');
                } else {
                    $('.toggle-sidebar-top span').removeClass('icon-user-unfollow').addClass('icon-user-following');
                }
            });
        }

        /* Change statut of user in sidebar: available, busy, away, invisible */
        function changeUserStatut() {
            $('.sidebar').off('click', '.user-login li a');
            $('.sidebar').on('click', '.user-login li a', function(e) {
                e.preventDefault();
                var statut = $(this).find('span').text();
                currentStatut = $('.user-login button span').text();
                $('.user-login button span').text(statut);
                if (statut == 'Busy') {
                    $('.user-login button i:not(.fa)').removeClass().addClass('busy');
                }
                if (statut == 'Invisible') {
                    $('.user-login button i:not(.fa)').removeClass().addClass('turquoise');
                }
                if (statut == 'Away') {
                    $('.user-login button i:not(.fa)').removeClass().addClass('away');
                }
            });
        }

        /* Create custom scroll for sidebar used for fixed sidebar */
        function createSideScroll() {
            if ($.fn.mCustomScrollbar) {
                destroySideScroll();
                if (!$('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-collapsed') && !$('body').hasClass('submenu-hover') && $('body').hasClass('fixed-sidebar')) {
                    $('.sidebar-inner').mCustomScrollbar({
                        scrollButtons: {
                            enable: false
                        },
                        autoHideScrollbar: true,
                        scrollInertia: 150,
                        theme: "light-thin",
                        advanced: {
                            updateOnContentResize: true
                        }
                    });
                }
                if ($('body').hasClass('sidebar-top')) {
                    destroySideScroll();
                }
            }
        }

        /* Destroy sidebar custom scroll */
        function destroySideScroll() {
            $('.sidebar-inner').mCustomScrollbar("destroy");
        }

        /* Toggle submenu open */
        function toggleSidebarMenu() {
            // Check if sidebar is collapsed
            if ($('body').hasClass('sidebar-collapsed') || $('body').hasClass('sidebar-top') || $('body').hasClass('submenu-hover'))
                $('.nav-sidebar .children').css({
                    display: ''
                });
            else $('.nav-active.active .children').css('display', 'block');

            //先注销事件，否则重复执行
            $('.sidebar').off('click', '.nav-sidebar li.nav-parent > a');
            $('.sidebar').on('click', '.nav-sidebar li.nav-parent > a', function(e) {
                e.preventDefault();

                if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
                if ($('body').hasClass('submenu-hover')) return;
                var parent = $(this).parent().parent();
                parent.children('li.active').children('.children').slideUp(200);
                $('.nav-sidebar .arrow').removeClass('active');
                /**
                 * do not remove 'active' class before route changed
                 * 'active' class will be removed automatic after route changed
                 * modified by youhaiyang at 2016.07.27
                 */
                //parent.children('li.active').removeClass('active');
                var sub = $(this).next();
                if (sub.is(":visible")) {
                    sub.children().addClass('hidden-item')
                    //$(this).parent().removeClass("active");
                    sub.slideUp(200, function() {
                        sub.children().removeClass('hidden-item')
                    });
                } else {
                    $(this).find('.arrow').addClass('active');
                    sub.children().addClass('is-hidden');
                    setTimeout(function() {
                        sub.children().addClass('is-shown');
                    }, 0);
                    sub.slideDown(200, function() {
                        /**
                         * do not add 'active' class before route changed
                         * 'active' class will be added automatic after route changed
                         * modified by youhaiyang at 2016.07.27
                         */
                        //$(this).parent().addClass("active");
                        setTimeout(function() {
                            sub.children().removeClass('is-hidden').removeClass('is-shown');
                        }, 500);
                    });
                }
            });
        }

        /**** Handle Sidebar Widgets ****/
        function sidebarWidgets() {
            /* Folders Widget */
            if ($('.sidebar-widgets .folders').length) {
                $('.new-folder').off('click');
                $('.new-folder').on('click', function() {
                    $('.sidebar-widgets .add-folder').show();
                    return false;
                });
                $(".add-folder input").keypress(function(e) {
                    if (e.which == 13) {
                        $('.sidebar-widgets .add-folder').hide();
                        $('<li><a href="#"><i class="icon-docs c-blue"></i>' + $(this).val() + '</a> </li>').insertBefore(".add-folder");
                        $(this).val('');
                    }
                });
                $('.main-content').click(function(ev) {
                    addFolder = document.getElementById('add-folder');
                    var target = ev.target;
                    if (target !== addFolder) {
                        $('.sidebar-widgets .add-folder').hide();
                    }
                });
            }
            /* Labels Widget */
            if ($('.sidebar-widgets .folders').length) {
                $('.new-label').off('click');
                $('.new-label').on('click', function() {
                    $('.sidebar-widgets .add-label').show();
                    return false;
                });
                $(".add-label input").keypress(function(e) {
                    if (e.which == 13) {
                        $('.sidebar-widgets .add-label').hide();
                        $('<li><a href="#"><i class="fa fa-circle-o c-blue"></i>' + $(this).val() + '</a> </li>').insertBefore(".add-label");
                        $(this).val('');
                    }
                });
                $('.main-content').click(function(ev) { //
                    addFolder = document.getElementById('add-label');
                    var target = ev.target;
                    if (target !== addFolder) {
                        $('.sidebar-widgets .add-label').hide();
                    }
                });
            }
            /* Sparkline  Widget */
            if ($.fn.sparkline && $('.dynamicbar1').length) {
                var myvalues1 = [13, 14, 16, 15, 11, 14, 20, 14, 12, 16, 11, 17, 19, 16];
                var myvalues2 = [14, 17, 16, 12, 18, 16, 22, 15, 14, 17, 11, 18, 11, 12];
                var myvalues3 = [18, 14, 15, 14, 15, 12, 21, 16, 18, 14, 12, 15, 17, 19];
                var sparkline1 = $('.dynamicbar1').sparkline(myvalues1, {
                    type: 'bar',
                    barColor: '#319DB5',
                    barWidth: 4,
                    barSpacing: 1,
                    height: '28px'
                });
                var sparkline2 = $('.dynamicbar2').sparkline(myvalues2, {
                    type: 'bar',
                    barColor: '#C75757',
                    barWidth: 4,
                    barSpacing: 1,
                    height: '28px'
                });
                var sparkline3 = $('.dynamicbar3').sparkline(myvalues3, {
                    type: 'bar',
                    barColor: '#18A689',
                    barWidth: 4,
                    barSpacing: 1,
                    height: '28px'
                });
            };
            /* Progress Bar  Widget */
            if ($('.sidebar-widgets .progress-chart').length) {
                $(window).load(function() {
                    setTimeout(function() {
                        $('.sidebar-widgets .progress-chart .stat1').progressbar();
                    }, 900);
                    setTimeout(function() {
                        $('.sidebar-widgets .progress-chart .stat2').progressbar();
                    }, 1200);
                    setTimeout(function() {
                        $('.sidebar-widgets .progress-chart .stat3').progressbar();
                    }, 1500);
                });
            };
            $('.sidebar').off('click', '.hide-widget');
            $('.sidebar').on('click', '.hide-widget', function(e) {
                e.preventDefault();
                if (start == 0) {
                    start = new Date().getTime();
                    $(this).toggleClass('widget-hidden');
                    var this_widget = $(this).parent().parent().next();
                    this_widget.slideToggle(200, function() {
                        createSideScroll();
                    });
                    end = new Date().getTime();
                    delta = end - start;
                } else {
                    end = new Date().getTime();
                    delta = end - start;
                    if (delta > 200) {
                        start = new Date().getTime();
                        $(this).toggleClass('widget-hidden');
                        var this_widget = $(this).parent().parent().next();
                        this_widget.slideToggle(200, function() {
                            createSideScroll();
                        });
                        end = new Date().getTime();
                        delta = end - start;
                    }
                }
            });
        }


        /* END SIDEBAR                                               */
        /* ========================================================= */
        /* Switch Top navigation to Sidebar */
        function reposition_topnav() {
            if ($('.nav-horizontal').length > 0) {
                topbarWidth = $('.topbar').width();
                headerRightWidth = $('.header-right').width();
                if ($('.header-left .nav-horizontal').length) headerLeftWidth = $('.header-left').width() + 40;
                else headerLeftWidth = $('.nav-sidebar.nav-horizontal > li').length * 140;
                var topbarSpace = topbarWidth - headerLeftWidth - headerRightWidth;
                // top navigation move to left nav if not enough space in topbar
                if ($('.nav-horizontal').css('position') == 'relative' || topbarSpace < 0) {
                    if ($('.sidebar .nav-sidebar').length == 2) {
                        $('.nav-horizontal').insertAfter('.nav-sidebar:eq(1)');
                    } else {
                        // only add to bottom if .nav-horizontal is not yet in the left panel
                        if ($('.sidebar .nav-horizontal').length == 0) {
                            $('.nav-horizontal').appendTo('.sidebar-inner');
                            $('.sidebar-widgets').css('margin-bottom', 20);
                        }
                    }
                    $('.nav-horizontal').css({
                        display: 'block'
                    }).addClass('nav-sidebar').css('margin-bottom', 100);
                    createSideScroll();
                    $('.nav-horizontal .children').removeClass('dropdown-menu');
                    $('.nav-horizontal > li').each(function() {
                        $(this).removeClass('open');
                        $(this).find('a').removeAttr('class');
                        $(this).find('a').removeAttr('data-toggle');
                    });
                    /* We hide mega menu in sidebar since video / images are too big and not adapted to sidebar */
                    if ($('.nav-horizontal').hasClass('mmenu')) $('.nav-horizontal.mmenu').css('height', 0).css('overflow', 'hidden');
                } else {
                    if ($('.sidebar .nav-horizontal').length > 0) {
                        $('.sidebar-widgets').css('margin-bottom', 100);
                        $('.nav-horizontal').removeClass('nav-sidebar').appendTo('.topnav');
                        $('.nav-horizontal .children').addClass('dropdown-menu').removeAttr('style');
                        $('.nav-horizontal li:last-child').show();
                        $('.nav-horizontal > li > a').each(function() {
                            $(this).parent().removeClass('active');
                            if ($(this).parent().find('.dropdown-menu').length > 0) {
                                $(this).attr('class', 'dropdown-toggle');
                                $(this).attr('data-toggle', 'dropdown');
                            }
                        });
                    }
                    /* If mega menu, we make it visible */
                    if ($('.nav-horizontal').hasClass('mmenu')) $('.nav-horizontal.mmenu').css('height', '').css('overflow', '');
                }
            }
        }


        /***** Scroll to top button *****/
        function scrollTop() {
            $(window).scroll(function() {
                if ($(this).scrollTop() > 100) {
                    $('.scrollup').fadeIn();
                } else {
                    $('.scrollup').fadeOut();
                }
            });
            $('.scrollup').click(function() {
                $("html, body").animate({
                    scrollTop: 0
                }, 1000);
                return false;
            });
        }

        function sidebarBehaviour() {
            windowWidth = $(window).width();
            windowHeight = $(window).height() - $('.topbar').height();
            sidebarMenuHeight = $('.nav-sidebar').height();
            if (windowWidth < 1024) {
                $('body').removeClass('sidebar-collapsed');
            }
            if ($('body').hasClass('sidebar-collapsed') && sidebarMenuHeight > windowHeight) {
                $('body').removeClass('fixed-sidebar');
                destroySideScroll();
            }
        }

        /* Function for datables filter in head */
        function stopPropagation(evt) {
            if (evt.stopPropagation !== undefined) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        }

        function detectIE() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            var trident = ua.indexOf('Trident/');
            var edge = ua.indexOf('Edge/');
            if (msie > 0 || trident > 0 || edge > 0) {
                $('html').addClass('ie-browser');
            }
        }

        /****  Initiation of Main Functions  ****/
        function init() {
            /* ==========================================================*/
            /* APPLICATION SCRIPTS                                       */
            /* ========================================================= */
            doc = document;
            docEl = document.documentElement;
            $body = $('body');
            $sidebar = $('.sidebar');
            $sidebarFooter = $('.sidebar .sidebar-footer');
            $mainContent = $('.main-content');
            $pageContent = $('[ng-view]');
            $topbar = $('.topbar');
            $logopanel = $('.logopanel');
            $sidebarWidth = $(".sidebar").width();
            content = document.querySelector('[ng-view]');
            is_RTL = false;
            $loader = $('#preloader');
            docHeight = $(document).height();
            windowHeight = $(window).height();
            topbarWidth = $('.topbar').width();
            headerLeftWidth = $('.header-left').width();
            headerRightWidth = $('.header-right').width();
            start = delta = end = 0;

            $('[data-toggle]').off('click');
            $('[data-toggle]').on('click', function(event) {
                event.preventDefault();
                var toggleLayout = $(this).data('toggle');
                if (toggleLayout == 'rtl') toggleRTL();
                if (toggleLayout == 'sidebar-behaviour') toggleSidebar();
                if (toggleLayout == 'submenu') toggleSubmenuHover();
                if (toggleLayout == 'sidebar-collapsed') collapsedSidebar();
                if (toggleLayout == 'sidebar-hover') toggleSidebarHover();
                if (toggleLayout == 'boxed') toggleboxedLayout();
                if (toggleLayout == 'topbar') toggleTopbar();
            });


            if ($('body').hasClass('rtl')) {
                is_RTL = true;
            }

            $('.toggle_fullscreen').click(function() {
                toggleFullScreen();
            });

            // Add class everytime a mouse pointer hover over it
            var hoverTimeout;
            $('.nav-sidebar > li').hover(function() {
                clearTimeout(hoverTimeout);
                $(this).siblings().removeClass('nav-hover');
                $(this).addClass('nav-hover');
            }, function() {
                var $self = $(this);
                hoverTimeout = setTimeout(function() {
                    $self.removeClass('nav-hover');
                }, 200);
            });

            $('.nav-sidebar > li .children').hover(function() {
                clearTimeout(hoverTimeout);
                $(this).closest('.nav-parent').siblings().removeClass('nav-hover');
                $(this).closest('.nav-parent').addClass('nav-hover');
            }, function() {
                var $self = $(this);
                hoverTimeout = setTimeout(function() {
                    $(this).closest('.nav-parent').removeClass('nav-hover');
                }, 200);
            });

            // Check if sidebar is collapsed
            if ($('body').hasClass('sidebar-collapsed'))
                $('.nav-sidebar .children').css({
                    display: ''
                });
            // Handles form inside of dropdown 
            $('.dropdown-menu').find('form').click(function(e) {
                e.stopPropagation();
            });

            createSideScroll();
            toggleSidebarMenu();
            customScroll();
            //handleSidebarSortable();
            sidebarWidgets();
            reposition_topnav();
            //handleSidebarRemove();
            handleSidebarHide();
            changeUserStatut();
            handlePanelAction();
            scrollTop();
            sidebarBehaviour();
            detectIE();
            setTimeout(function() {
                handleboxedLayout();
            }, 100);

            if ($('body').hasClass('sidebar-hover')) sidebarHover();
        };

        /****  Resize Event Functions  ****/

        $(window).resize(function() {
            setTimeout(function() {
                customScroll();
                reposition_topnav();
                if (!$('body').hasClass('fixed-sidebar') && !$('body').hasClass('builder-admin')) sidebarBehaviour();
                handleboxedLayout();
                maximizePanel();
            }, 100);
        });

        var applicationService = {};

        applicationService.init = init;
        applicationService.toggleRTL = toggleRTL;
        applicationService.handleSidebarFluid = handleSidebarFluid;
        applicationService.handleSidebarSortable = handleSidebarSortable;
        applicationService.handleSidebarHide = handleSidebarHide;
        applicationService.handleSidebarRemove = handleSidebarRemove;
        applicationService.customScroll = customScroll;
        applicationService.handleSidebarFixed = handleSidebarFixed;
        applicationService.handleTopbarFixed = handleTopbarFixed;
        applicationService.handleTopbarFluid = handleTopbarFluid;
        applicationService.createSidebarHover = createSidebarHover;
        applicationService.removeSidebarHover = removeSidebarHover;
        applicationService.createSubmenuHover = createSubmenuHover;
        applicationService.removeSubmenuHover = removeSubmenuHover;
        applicationService.createBoxedLayout = createBoxedLayout;
        applicationService.removeBoxedLayout = removeBoxedLayout;
        applicationService.resetStyle = resetStyle;
        applicationService.disableRTL = disableRTL;
        applicationService.enableRTL = enableRTL;
        applicationService.toggleSidebar = toggleSidebar;
        applicationService.toggleSubmenuHover = toggleSubmenuHover;
        applicationService.collapsedSidebar = collapsedSidebar;
        applicationService.toggleSidebarHover = toggleSidebarHover;
        applicationService.toggleboxedLayout = toggleboxedLayout;
        applicationService.toggleTopbar = toggleTopbar;
        applicationService.handlePanelAction = handlePanelAction;
        applicationService.toggleSidebarMenu = toggleSidebarMenu;
        applicationService.menuResource = $resource('/script/data/menus.json', {}, { 'query': {isArray: false}});
        return applicationService;

    }]).factory('builderService', ['applicationService', function(applicationService) {


        var builderService = {};

        /* ============================================================
         * Builder Script
         =========================================================== */
        $.cookie.defaults.path = '/';

        /**** BUILDER FUNCTIONS ****/
        function toggleBuilder() {
            $('.builder-toggle').off('click');
            $('.builder-toggle').on('click', function() {
                if ($('#builder').hasClass('open')) $('#builder').removeClass('open');
                else $('#builder').addClass('open');
            });
        }

        // /* Active Custom Scroll for Builder Sidebar */
        // function builderScroll() {
        //     $('.builder .inner').mCustomScrollbar("destroy");
        //     scroll_height = "100%";
        //     $('.builder .inner').mCustomScrollbar({
        //         scrollButtons: {
        //             enable: false
        //         },
        //         autoHideScrollbar: true,
        //         scrollInertia: 150,
        //         theme: "light",
        //         set_height: scroll_height,
        //         advanced: {
        //             updateOnContentResize: true
        //         }
        //     });
        // }

        // /* Destroy sidebar custom scroll */
        // function destroySideScroll() {
        //     $('.sidebar-inner').mCustomScrollbar("destroy");
        // }

        /* Enable / Disable Layouts */
        function handleLayout() {
            $('.layout-option input').off('click');
            $('.layout-option input').on('click', function() {
                var layout = $(this).attr('data-layout');
                var is_checked = $(this).prop('checked');
                if (layout == 'sidebar' && is_checked == true) applicationService.handleSidebarFixed();
                if (layout == 'sidebar' && is_checked == false) applicationService.handleSidebarFluid();
                if (layout == 'topbar' && is_checked == true) applicationService.handleTopbarFixed();
                if (layout == 'topbar' && is_checked == false) applicationService.handleTopbarFluid();
                if (layout == 'sidebar-hover' && is_checked == true) applicationService.createSidebarHover();
                if (layout == 'sidebar-hover' && is_checked == false) applicationService.removeSidebarHover();
                if (layout == 'submenu-hover' && is_checked == true) applicationService.createSubmenuHover();
                if (layout == 'submenu-hover' && is_checked == false) applicationService.removeSubmenuHover();
                if (layout == 'boxed' && is_checked == true) applicationService.createBoxedLayout();
                if (layout == 'boxed' && is_checked == false) applicationService.removeBoxedLayout();
            });
        }

        /* Main Color */
        function mainColor() {
            $('.theme-color').off('click');
            $('.theme-color').on('click', function(e) {
                e.preventDefault();
                var main_color = $(this).data('color');
                var main_name = $(this).attr('data-main');
                $('body').removeClass(function(index, css) {
                    return (css.match(/(^|\s)color-\S+/g) || []).join(' ');
                });
                $('body').addClass('color-' + main_name);
                $('.theme-color').removeClass('active');
                $(this).addClass('active');
                if ($(this).data('main') == 'default') {
                    $('.theme-left').css('background-color', '#202226');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#393E44');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#fff');
                    $('.sltl .theme-left').css('background-color', '#fff');
                }
                if ($(this).data('main') == 'primary') {
                    $('.theme-left').css('background-color', '#319DB5');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#164954');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#DDE6E9');
                }
                if ($(this).data('main') == 'red') {
                    $('.theme-left').css('background-color', '#C9625F');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#4E3232');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#F8F3F1');
                }
                if ($(this).data('main') == 'green') {
                    $('.theme-left').css('background-color', '#18A689');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#24392E');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#F1F8F3');
                }
                if ($(this).data('main') == 'orange') {
                    $('.theme-left').css('background-color', '#C58627');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#50361F');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#F8F4F1');
                }
                if ($(this).data('main') == 'purple') {
                    $('.theme-left').css('background-color', '#6E62B5');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#393F51');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#F3F2F7');
                }
                if ($(this).data('main') == 'blue') {
                    $('.theme-left').css('background-color', '#4A89DC');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#1E3948');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#F2F4F7');
                }
                $.cookie('main-color', main_color, { path: '/' });
                $.cookie('main-name', main_name, { path: '/' });
            });
        }

        /* Switch Theme */
        function handleTheme() {
            $('.theme').off('click');
            $('.theme').on('click', function(e) {
                e.preventDefault();
                $('.theme').removeClass('active');
                $(this).addClass('active');
                var theme_name = $(this).attr('data-theme');
                switchTheme(theme_name);
            });

            function switchTheme(name) {
                if (name == null) {
                    $('.theme-sidebar-defaut').addClass('active');
                    $.cookie('theme', name, { path: '/' });
                } else {
                    $('.theme-sidebar-' + name).addClass('active');
                    $('body').removeClass(function(index, css) {
                        return (css.match(/(^|\s)theme-\S+/g) || []).join(' ');
                    });
                    $('body').addClass('theme-' + name);
                    $.cookie('theme', name, { path: '/' });
                }
            }
        }

        /* Background Color */
        function backgroundColor() {
            $('.bg-color').off('click');
            $('.bg-color').on('click', function(e) {
                e.preventDefault();
                var bg_color = $(this).data('color');
                var bg_name = $(this).attr('data-bg');
                $('body').removeClass(function(index, css) {
                    return (css.match(/(^|\s)bg-\S+/g) || []).join(' ');
                });
                $('body').addClass('bg-' + bg_name);
                $('.bg-color').removeClass('active');
                $(this).addClass('active');
                $.cookie('bg-color', bg_color, { path: '/' });
                $.cookie('bg-name', bg_name, { path: '/' });
            });
        }

        /* Manage Cookie */
        function handleCookie() {
            if ($.cookie('rtl')) applicationService.enableRTL();
            if ($.cookie('fluid-topbar')) applicationService.handleTopbarFluid();
            if ($.cookie('fixed-sidebar')) applicationService.handleSidebarFixed();
            if ($.cookie('fluid-sidebar')) applicationService.handleSidebarFluid();
            if ($.cookie('sidebar-hover')) applicationService.createSidebarHover();
            if ($.cookie('submenu-hover')) applicationService.createSubmenuHover();
            if ($.cookie('boxed-layout')) applicationService.createBoxedLayout();
            if ($.cookie('sidebar-collapsed') && $.cookie('first-load')) applicationService.createCollapsedSidebar();
            if ($.cookie('main-name')) {
                var main_name = $.cookie('main-name');
                $('body').removeClass(function(index, css) {
                    return (css.match(/(^|\s)color-\S+/g) || []).join(' ');
                });
                $('body').addClass('color-' + main_name);
                $('.theme-color').each(function() {
                    if ($(this).data('main') == main_name) $(this).addClass('active');
                });
                if (main_name == 'default') {
                    $('.theme-left').css('background-color', '#202226');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#393E44');
                    $('.theme-sidebar-light, .theme-right-light').css('background-color', '#fff');
                    $('.sltl .theme-left').css('background-color', '#fff');
                }
                if (main_name == 'primary') {
                    $('.theme-left').css('background-color', '#319DB5');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#164954');
                }
                if (main_name == 'red') {
                    $('.theme-left').css('background-color', '#C9625F');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#4E3232');
                }
                if (main_name == 'green') {
                    $('.theme-left').css('background-color', '#18A689');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#24392E');
                }
                if (main_name == 'orange') {
                    $('.theme-left').css('background-color', '#C58627');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#50361F');
                }
                if (main_name == 'purple') {
                    $('.theme-left').css('background-color', '#6E62B5');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#393F51');
                }
                if (main_name == 'blue') {
                    $('.theme-left').css('background-color', '#4A89DC');
                    $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#1E3948');
                }
            }

            if (!$.cookie('main-color')) {
                $('.theme-color').each(function() {
                    if ($(this).data('color') == '#2B2E33') $(this).addClass('active');
                });
                $('body').addClass('color-default');
            }
            // Background Color
            if ($.cookie('bg-color')) {
                var bg_color = $.cookie('bg-color');
                $('.bg-color').each(function() {
                    if ($(this).data('color') == bg_color) $(this).addClass('active');
                });
            }
            if ($.cookie('bg-name')) {
                var bg_color = $.cookie('bg-name');
                $('body').addClass('bg-' + bg_color);
            }
            if (!$.cookie('bg-color')) {
                $('.bg-color').each(function() {
                    if ($(this).data('color') == '#E9E9E9') $(this).addClass('active');
                });
            }
            // Sidebar Color
            if ($.cookie('theme')) {
                $('body').removeClass(function(index, css) {
                    return (css.match(/(^|\s)theme-\S+/g) || []).join(' ');
                });
                var theme = $.cookie('theme');
                $('.builder .' + theme).addClass('active');
                $('body').addClass('theme-' + theme);

                $('.theme').each(function() {
                    if ($(this).data('theme') == theme) $(this).addClass('active');
                });
            }
            if (!$.cookie('theme')) {
                $('.theme.sdtl').addClass('active');
            }
            if (!$.cookie('main-color')) {
                $('body').addClass('theme-sdtl');
                $('.theme-left').css('background-color', '#202226');
                $('.theme-sidebar-dark, .theme-right-dark').css('background-color', '#393E44');
            }
        }

        builderService.init = function() {
            "use strict";

            // $.removeCookie('main-color');
            // $.removeCookie('topbar-color');
            // $.removeCookie('topbar-color-custom');
            // $.removeCookie('sidebar-color');
            // $.removeCookie('sidebar-color-custom');
            // $.removeCookie('sidebar-hover');
            // $.removeCookie('submenu-hover');

            toggleBuilder();
            //builderScroll();
            handleLayout();
            handleTheme();
            handleCookie();
            mainColor();
            backgroundColor();
            applicationService.resetStyle();

            if ($('body').hasClass('sidebar-top')) {
                destroySideScroll();
            }

        };

        return builderService;

    }]).directive('ngSpinnerLoader', ['$rootScope',
        function($rootScope) {
            return {
                link: function(scope, element, attrs) {
                    // by defult hide the spinner bar
                    element.addClass('hide'); // hide spinner bar by default
                    // display the spinner bar whenever the route changes(the content part started loading)
                    $rootScope.$on('$stateChangeStart', function() {
                        element.removeClass('hide'); // show spinner bar
                    });
                    // hide the spinner bar on rounte change success(after the content loaded)
                    $rootScope.$on('$stateChangeSuccess', function() {
                        setTimeout(function() {
                            element.addClass('hide'); // hide spinner bar
                        }, 500);
                        $("html, body").animate({
                            scrollTop: 0
                        }, 500);
                    });
                }
            };
        }
    ]).directive('ngViewClass', ['$location', '$state', '$timeout', function($location, $state, $timeout) {
        return {
            link: function(scope, element, attrs, controllers) {
                var classes = attrs.ngViewClass ? attrs.ngViewClass.replace(/ /g, '').split(',') : [];
                $timeout(function() {
                    if ($(element).hasClass('ng-enter')) {
                        for (var i = 0; i < classes.length; i++) {
                            var route = classes[i].split(':')[1];
                            var newclass = classes[i].split(':')[0];

                            if (route === $location.path()) {
                                $(element).addClass(newclass);
                            } else {
                                $(element).removeClass(newclass);
                            }
                        }
                    }
                })

            }
        };
    }]).directive('menuActive', ['$location', '$timeout', function($location, $timeout) {
        //刷新时根据子菜单的active设置上级菜单样式
        return {
            restrict: 'AE',
            link: function(scope, iElement, iAttrs) {
                $timeout(function() {
                    var submenusRoot = iElement.children('ul');
                    if (submenusRoot && submenusRoot.length > 0) {
                        var submenus = submenusRoot.find('li>a');
                        for (var i = 0; i < submenus.length; i++) {
                            var submenu = submenus[i];
                            var href = $(submenu).attr('href').replace('#', '');
                            if (href === $location.path()) {
                                iElement.addClass('active');
                                $(submenu).closest('li').addClass('active');
                                submenusRoot.css('display', 'block');
                                break;
                            }
                        }
                    }
                });
            }
        };
    }]).directive('tableFullSize', ['$timeout', function($timeout) {
        /**
         * bootstrap table fill full page
         */
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {

                function getHeight() {
                    var tb = $(iElement);
                    return $(window).height() - tb.offset().top;
                }

                function resetView() {
                    $(iElement).bootstrapTable('resetView', {
                        height: getHeight()
                    });
                }

                $timeout(function() {
                    resetView();

                    $(window).resize(function() {
                        resetView();
                    });
                });
            }
        };
    }])
    .directive('focusIf', ['$timeout', function($timeout) {
        function link($scope, $element, $attrs) {
            var dom = $element[0];
            if ($attrs.focusIf) {
                $scope.$watch($attrs.focusIf, focus);
            } else {
                focus(true);
            }

            function focus(condition) {
                if (condition) {
                    $timeout(function() {
                        dom.focus();
                    }, $scope.$eval($attrs.focusDelay) || 0);
                }
            }
        }
        return {
            restrict: 'A',
            link: link
        };
    }]);
