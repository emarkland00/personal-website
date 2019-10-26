(function() {
    'use strict'

    const comingSoonMessage = 'Content coming soon!';
    const contentContainer = document.getElementById('latest-entry-content');
    if (!latest_json) {
        contentContainer.append(comingSoonMessage);
        return;
    }

    const createHtmlElement = htmlString => {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
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
    latest_json.forEach(json => {
        const elem = createArticle(json);
        contentContainer.append(elem);
    });
}());
