(function() {
    'use strict'
    
    const ID_ARTICLE_CONTENT = 'latest-articles';
    const ID_ARTICLE_CONTENT_ENTRY = 'latest-entry-content';
    const ID_ARTICLE_FOOTER = 'article-footer';

    if (typeof latest_json === 'undefined') {
        document.getElementById(ID_ARTICLE_CONTENT).innerHTML = `<p>Content coming soon!</p>`;
        document.getElementById(ID_ARTICLE_FOOTER).style.display = 'none';
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
    const contentContainer = document.getElementById(ID_ARTICLE_CONTENT_ENTRY);
    latest_json.forEach(json => {
        const elem = createArticle(json);
        contentContainer.append(elem);
    });
}());
