import { Pipe, PipeTransform } from '@angular/core';
import { OperationalZone } from 'src/app/modules/rider/operational-zone/model/operational-zone';

@Pipe({
  name: 'uniqueRiderOpZoneFilter'
})
export class UniqueRiderOpZoneFilterPipe implements PipeTransform {

  transform(opZones: OperationalZone[], args: {id: number, name: string}[]): any {
    if(!opZones || !args) {
      return opZones;
    }
    return opZones.filter(zone => args.findIndex(item => item.id === zone.id) < 0)
  }

}
