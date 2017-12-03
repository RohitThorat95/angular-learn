import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';


@Injectable()
export class LeaderService {

  constructor() { }

getLeaders(): Promise<Leader[]> {
  return new Promise(resolve => {
    setTimeout( () => resolve(LEADERS));
  });
}

getLeader(id:number): Promise<Leader> {
  return new Promise(resolve => {
    setTimeout( () => resolve(LEADERS.filter((leader) => (leader.id === id))[0]));
  });
}

getFeaturedLeader(): Promise<Leader> {
  return new Promise( resolve => {
    setTimeout( () => resolve(LEADERS.filter( (leader) => (leader.featured))[0]));
  });
}

}
