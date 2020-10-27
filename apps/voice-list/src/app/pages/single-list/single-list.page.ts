import { StorageService } from '../../services/storage.service';
import { Component, OnDestroy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceService } from '../../services/voice.service';
import { MatRipple } from '@angular/material/core';
import { List, State } from '../../list.reducer';
import { Store } from '@ngrx/store';
import { deleteList } from '../../list.actions';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-single-list',
  templateUrl: './single-list.page.html',
  styleUrls: ['./single-list.page.css']
})
export class SingleListPage implements OnDestroy {
  @ViewChild(MatRipple) ripple: MatRipple;

  list: List;
  completedPercentage: number;
  listening: boolean;
  listeningTrigger;

  constructor(
    private router: Router,
    private storage: StorageService,
    private voice: VoiceService,
    private store: Store<{appState: State}>,
    private dialog: MatDialog,
    private changeRef: ChangeDetectorRef) {

      const list = this.router.getCurrentNavigation().extras.state as List;
      
      this.list = !list
        ? this.storage.get<List>('current-list')
        : list;

      this.calculatePercentage();
      this.storage.save('current-list', this.list);
      this.toggleListening(false);
  }

  toggleListening(checked: boolean) {
    this.listening = checked;

    if (checked) {
      this.listeningTrigger = setInterval(() => {
          const rippleRef = this.ripple.launch({
            centered: true,
          });
    
          rippleRef.fadeOut();
        }, 2000);

      this.startListening();
    } else {
      clearInterval(this.listeningTrigger);
      this.voice.teardown();
    }
  }

  deleteList(deleteTemplate: TemplateRef<any>) {
    this.dialog.open(deleteTemplate)
      .afterClosed()
      .pipe(filter(response => !!response))
      .subscribe(() => {
        console.log('deleting list');
        this.store.dispatch(deleteList({listName: this.list.listName}));
        this.router.navigateByUrl('/lists');
      });
  }

  startListening() {
    // const add = (item: string) => { this.addItem(item); };
    // const remove = (item: string) => {this.removeItem(item)};
    // const markComplete = (item: string) => { this.markAsComplete(item) };
    // const markIncomplete = (item: string) => { this.markAsIncomplete(item) };
    // const stop = () => { this.voice.teardown(); this.listening = false; }

    // const commands = [
    //   {
    //     'stop listening': stop
    //   },
    //   {
    //     'add :item': add,
    //     'we need :item': add
    //   },
    //   {
    //     'remove :item': remove,
    //     'delete :item': remove
    //   },
    //   {
    //     'check :item': markComplete,
    //     'we got :item': markComplete,
    //     'we have :item': markComplete
    //   },
    //   {
    //     'uncheck :item': markIncomplete
    //   },
    //   {
    //     'complete all': () => {
    //       for (const item in this.list.items) {
    //         this.markAsComplete(item);
    //       }
    //     }
    //   }
    // ];

    // @ts-ignore
    // this.voice.addCommands(commands).init();
  }

  calculatePercentage() {
    this.completedPercentage = (this.list.completed * 100) / (this.list.completed + this.list.pending);
  }

  // updateItem(itemName: string, value: boolean) {
  //   value
  //   ? this.markAsComplete(itemName)
  //   : this.markAsIncomplete(itemName);

  // }

  ngOnDestroy(): void {
    this.voice.teardown();
  }
  
  // addItem(itemName: string): void {
  //   if (itemName in this.list.items) { return; }

  //   this.list.items[itemName] = false;
  //   this.list.pending++;
  //   this.calculatePercentage();
  //   console.log(this.list.items);
  //   this.changeRef.detectChanges();
  // }

  // markAsComplete(itemName: string): void {
  //   if (!(itemName in this.list.items)) { return; }    
  //   if (this.list.items[itemName] === true) { return; }

  //   this.list.items[itemName] = true;
  //   this.list.pending--;
  //   this.list.completed++;
  //   this.calculatePercentage();
  //   this.changeRef.detectChanges();
  // }

  // markAsIncomplete(itemName: string): void {
  //   if (this.list.items[itemName] === false) { return; }
  //   this.list.items[itemName] = false;
  //   this.list.pending++;
  //   this.list.completed--;
  //   this.calculatePercentage();
  //   this.changeRef.detectChanges();
  // }

  // removeItem(itemName: string): void {
  //   if (!(itemName in this.list.items)) { return; }

  //   const completed = this.list.items[itemName];

  //   completed
  //     ? this.list.completed--
  //     : this.list.pending--;

  //   delete this.list.items[itemName];
  //   this.calculatePercentage();
  //   this.changeRef.detectChanges();
  // }

  // toggle(itemName: string) {
  //   if (!(itemName in this.list.items)) { return; }

  //   console.log(itemName);
  //   this.list.items[itemName]
  //     ? this.markAsIncomplete(itemName)
  //     : this.markAsComplete(itemName);
  // }

}
