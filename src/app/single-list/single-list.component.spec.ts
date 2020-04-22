import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SingleListComponent } from './single-list.component';
import { generateFakeList } from 'src/testing/fake-gen';
import { Router } from '@angular/router';

class RouterWithExtras {
  getCurrentNavigation() {
    return {
      extras: {
        state: generateFakeList('Grocery List')
      }
    }
  }
}

fdescribe('SingleListComponent', () => {
  let component: SingleListComponent;
  let fixture: ComponentFixture<SingleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleListComponent ],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useClass: RouterWithExtras }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('markAsCompleted', () => {
    it('should correct mark an item as completed', () => {
      expect(component.list.completed).toBe(1);
      component.markAsCompleted('Eggs');
      console.log(component.list.items);
      expect(component.list.items['Eggs']).toBe(true);
      expect(component.list.completed).toBe(2);
      expect(component.list.pending).toBe(1);
    });

    it('should not make any changes if specified item is already completed', () => {
      expect(component.list.completed).toBe(1);
      component.markAsCompleted('Fish');

      expect(component.list.completed).toBe(1);
      expect(component.list.items['Fish']).toBe(true);
    });
  });

  describe('Adding an item', () => {
    it('should correctly add a new item', () => {
      expect(component.list.pending).toBe(2);
      component.addItem('Butter');

      expect('Butter' in component.list.items).toBe(true);
      expect(component.list.items['Butter']).toBe(false);
      expect(component.list.pending).toBe(3);

    });

    it('shouldn\'t make any list changes if the item already exists', () => {
      const list = Object.assign({}, component.list);
      component.addItem('Milk');
      expect(component.list.pending).toBe(2);
      expect(component.list.items['Milk']).toBe(list.items['Milk']);
    });
  
  });

  fdescribe('Removing an item', () => {
    it('should correctly remove a completed item', () => {
      component.removeItem('Fish');

      expect(component.list.completed).toBe(0);
      expect(component.list.pending).toBe(2);
      expect('Fish' in component.list.items).toBe(false);
    });

    it('should correctly remove an incomplete item', () => {
      component.removeItem('Eggs');

      expect(component.list.completed).toBe(1);
      expect(component.list.pending).toBe(1);
      expect('Eggs' in component.list.items).toBe(false);
    })

    it('should not throw an error if removing an item that doesn\'t exist', () => {

      expect(() => {component.removeItem('Butter');}).not.toThrowError();
      expect(component.list.completed).toBe(1);
      expect(component.list.pending).toBe(2);
      
    });
  })
  
});
