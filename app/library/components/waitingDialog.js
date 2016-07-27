define(function() {

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="overflow-y:visible;">' +
        '<div class="modal-dialog modal-m">' +
        '<div class="modal-content">' +
        '<div class="modal-header"><h4 style="margin:0;"></h4></div>' +
        '<div class="modal-body">' +
        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
        '</div>' +
        '</div></div></div>');

    var openTime = new Date();

    return {
        show: function(message, options) {
            // Assigning defaults
            if (typeof options === 'undefined') {
                options = {};
            }
            if (typeof message === 'undefined') {
                message = '数据加载中';
            }
            var settings = $.extend({
                dialogSize: 'm',
                progressType: 'success',
                onHide: null // This callback runs after the dialog was hidden
            }, options);

            // Configuring dialog
            $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('.progress-bar').attr('class', 'progress-bar');
            if (settings.progressType) {
                $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
            }
            $dialog.find('h4').text(message);
            // Adding callbacks
            if (typeof settings.onHide === 'function') {
                $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function(e) {
                    settings.onHide.call($dialog);
                });
            }
            // Opening dialog
            $dialog.modal();
            openTime = new Date();
        },
        /**
         * Closes dialog
         */
        hide: function() {
		    var curTime = new Date();
		    var milliSeonds = curTime.getTime() - openTime.getTime();
		    //如果间隔大于0.5s，直接关闭，否则保持0.5秒再关
		    if (milliSeonds >= 1000)
            	$dialog.modal('hide');
            else
            	setTimeout(function () { $dialog.modal('hide'); }, 1000 - milliSeonds);
        }
    };

});
