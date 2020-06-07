import { Component } from '@angular/core';
import { NavLink } from '@qarun-qb/models';

@Component({
  selector: 'random-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  links: NavLink[] = [
    { title: 'Dice', route: '/dice', description: 'Toss any number of dice!' },
    { title: 'Pick a number', route: '/number-range', description: 'Randomly select a number within a range' },
    { title: 'Toss a coin', route: '/coin-toss', description: 'Can\'t decide Heads or Tails? Click here!' },
    { title: 'Rock, Paper, Scissors', route: '/rock-paper-scissors', description: '' }
  ]
  constructor() { }

}