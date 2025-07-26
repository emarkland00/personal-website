import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Interface for the article items
 **/
interface ArticleItem {
  // The name of the site where this article came from
  source: string;

  // The name of the article
  title: string;

  // The URL of this article
  url: string;
}

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AppComponent implements OnInit {
  readonly ID_ARTICLE_CONTENT: string = 'latest-articles';
  readonly ID_ARTICLE_CONTENT_ENTRY: string = 'latest-entry-content';
  readonly ID_ARTICLE_FOOTER: string = 'article-footer';
  readonly MOCK_ITEMS: ArticleItem[] = [{
    "source": "MOCK",
    "title": "MOCK TITLE",
    "url": "https://google.com"
  }];
  title = 'site';

  latestJson$: Observable<any[]> = of(this.MOCK_ITEMS);
  hasItems$: Observable<boolean> = of(false);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.latestJson$ = this.http.get<ArticleItem[]>('/assets/latest.json').pipe(
      catchError(err => {
        console.log(err);
        return of(this.MOCK_ITEMS);
      })
    );
    this.hasItems$ = this.latestJson$.pipe(map(items => items?.length > 0));
  }
}
