import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    "source": "MOCK",
    "title": "MOCK TITLE",
    "url": "https://google.com"
  }];
  title = 'site';

  latestJson$: Observable<any[]> = of(this.MOCK_ITEMS);
  hasItems$: Observable<boolean> = of(false);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //TODO: Get lambda function for latest articles stored in a repo
    this.latestJson$ = this.http.get<any[]>('/assets/latest.json').pipe(
      catchError(err => {
        console.log(err);
        return of(this.MOCK_ITEMS);
      })
    );
    this.hasItems$ = this.latestJson$.pipe(map(items => items?.length > 0));
  }
}
