(function($, undefined) {
    'use strict'
    
    let jsonResults = null;
    if (latest_json && !latest_json.error) {
        // helper methods for parsing json payload
        const getSource = json => {
            if (json.domain_metadata && json.domain_metadata.name) {
                return json.domain_metadata.name;
            }
            const dummyLinkForHost = document.createElement('a');
            dummyLinkForHost.href = json.resolved_url || json.given_url;
            return dummyLinkForHost.hostname;
        };
        const getDate = json => moment(json.timestamp).format('MMM D, YYYY');
        const getTitle = json => json.resolved_title;
        const getUrl = json => json.resolved_url;

        jsonResults = Object.values(latest_json.list).map(json => ({
            source: getSource(json),
            date: getDate(json),
            title: getTitle(json),
            url: getUrl(json)
        }));
    }

    const contentContainer = $('#latest-entry-content');
    if (!jsonResults) {
        contentContainer.append("Content coming soon!");
        return;
    }

    const template = Handlebars.templates.article;
    const parsedResults = jsonResults.map(json => $(template(json)));
    contentContainer.append(parsedResults);
}(jQuery));
