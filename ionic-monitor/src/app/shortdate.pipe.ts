import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortdate'
})
export class ShortdatePipe implements PipeTransform {

    transform(value: string, args?: any): any {
        return value.split('GMT').shift();
    }

}
