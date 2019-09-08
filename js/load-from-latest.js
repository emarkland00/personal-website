(function() {
    'use strict'

    if (!latest_json || latest_json.error) {
        return;
    }
    
    // helper methods for parsing json payload
    const getSource = json => {
        if (json.domain_metadata && json.domain_metadata.name) {
            return json.domain_metadata.name;
        }
        const dummyLinkForHost = document.createElement('a');
        dummyLinkForHost.href = json.resolved_url || json.given_url;
        return dummyLinkForHost.hostname;
    };
    const getTitle = json => json.resolved_title;
    const getUrl = json => json.resolved_url;

    const jsonResults = Object.values(latest_json.list).map(json => ({
        source: getSource(json),
        title: getTitle(json),
        url: getUrl(json)
    })).reverse(); // reverse items to display most recent articles from left to right

    const contentContainer = document.getElementById('latest-entry-content');
    if (!jsonResults) {
        contentContainer.append("Content coming soon!");
        return;
    }

    const createHtmlElement = htmlString => {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    };
    const jsonToHtmlString = json =>
        `<div class="4u 12u(mobile) article-item">
            <a href="${json.url}" target="_blank">
                <section class="box style1">
                    <h4>${json.title}</h4>
                    <p> <span class="latest-entry-content-item-source">[saw on ${json.source}]</span></p> 
                </section>
            </a>
        </div>`;  
    const createArticle = json => createHtmlElement(jsonToHtmlString(json));
    jsonResults.forEach(json => {
        const elem = createArticle(json);
        contentContainer.append(elem);
    });
}());
