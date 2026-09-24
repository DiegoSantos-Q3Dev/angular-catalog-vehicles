import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VToolbar } from './v-toolbar';

describe('VToolbar', () => {
  let component: VToolbar;
  let fixture: ComponentFixture<VToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VToolbar],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(VToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the shared menu interaction mode', () => {
    component.isTopMenuPinned.set(false);
    expect(component.toggleMenuModeIcon()).toBe('mouse');

    component.toggleMenuMode();

    expect(component.isTopMenuPinned()).toBe(true);
    expect(component.toggleMenuModeIcon()).toBe('mouse_lock');

    component.toggleMenuMode();

    expect(component.isTopMenuPinned()).toBe(false);
  });
});
