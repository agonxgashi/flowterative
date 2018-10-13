import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit = 25, ellipsis = '...') {
        const final = value.substr(0, limit);
        return final + (value.length > final.length ? ellipsis : '');
    }
}
