import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.sass' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  readonly ID_ARTICLE_CONTENT: string = 'latest-articles';
  readonly ID_ARTICLE_CONTENT_ENTRY: string = 'latest-entry-content';
  readonly ID_ARTICLE_FOOTER: string = 'article-footer';
  readonly MOCK_ITEMS: any[] = [{
    "source": "YouTube",
    "title": "A Daily Practice of Empirical Software Design - Kent Beck - DDD Europe 2023",
    "url": "https://youtube.com/watch?v=yBEcq23OgB4&si=L2ljKr2kvWzVGJVg"
  }, {
      "source": "www.maxcountryman.com",
      "title": "A Framework for Prioritizing Tech Debt",
      "url": "https://www.maxcountryman.com/articles/a-framework-for-prioritizing-tech-debt"
  }, {
      "source": "jvns.ca",
      "title": "A debugging manifesto",
      "url": "https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/"
  }];
  title = 'site';

  latestJson$: Observable<any[]> = of(this.MOCK_ITEMS);
  hasItems$: Observable<boolean> = of(false);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //TODO: Get lambda function for latest articles stored in a repo
    this.latestJson$ = this.http.get<any[]>('/js/latest.json').pipe(
      catchError(err => {
        console.log(err);
        return of(this.MOCK_ITEMS);
      })
    );
    this.hasItems$ = this.latestJson$.pipe(map(items => items?.length > 0));
  }
}
