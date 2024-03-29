import { TabComponent } from './../tab/tab.component';
import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-tabscontainer',
  templateUrl: './tabscontainer.component.html',
  styleUrls: ['./tabscontainer.component.css']
})
export class TabscontainerComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList<TabComponent>();

  constructor() { }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(tab => tab.active)

    if(!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach(tab => { tab.active = false; });

    tab.active = true;

    return false;
  }

}
