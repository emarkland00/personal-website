(function($, undefined) {
    'use strict'

    var contentContainer = $('#latest-entry-content'),
        contentHeader = $('#latest-entry-header'),
        contentContainerItem = 'latest-entry-content-item',
        contentItemSource = 'latest-entry-content-item-source';

    function fetchContent(json) {
        contentContainer.addClass('loader');
        $.ajax({
            type: 'POST',
            url: '../handlers/latest.php',
            data: json,
            dataType: 'json'
        })
        .done(function(data) {
            var hasData = false;
            contentContainer.removeClass('loader');
            for (var i in data) {
                hasData = true;
                var json = data[i];
                json.date = moment(json.timestamp).format('MMM D, YYYY');
            }

            if (hasData) {
                appendContentToPage(data);
            } else {
                contentContainer.append("Content coming soon!");
            }
        })
        .fail(function(data) {
                contentContainer.append("Content coming soon!");
        });
    }

    function appendContentToPage(json) {
        for (var i = 0; i < json.length; ++i) {
            var entry = $(createEntry((json[i])));
            contentContainer.append(entry);
        }
    };

    var template = "" +
        "<div class='4u 12u(mobile) article-item'>" +
            "<a href='{{url}}' target='_blank'>" +
                "<section class='box style1'>" +
                    "<h4>{{title}}</h4>" +
                    "<p>" +
                        "<span class='" + contentItemSource + "'>[saw on {{source}}]</span>" +
                    "</p>" +
                "</section>" +
            "</a>" +
        "</div>";

    var _compiledTemplate = null;

    function createEntry(json) {
        if (_compiledTemplate === null) {
            _compiledTemplate = Handlebars.templates.article;
        }
        return _compiledTemplate(json);
    };

    fetchContent({
        count: 3
    });
}(jQuery));
