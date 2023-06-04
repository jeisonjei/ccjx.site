import { BreakpointObserver,Breakpoints } from "@angular/cdk/layout";

export class Consts{
    public displayNameMap = new Map([
        [Breakpoints.XSmall, 'XSmall'],
        [Breakpoints.Small, 'Small'],
        [Breakpoints.Medium, 'Medium'],
        [Breakpoints.Large, 'Large'],
        [Breakpoints.XLarge, 'XLarge'],
      ]);
}