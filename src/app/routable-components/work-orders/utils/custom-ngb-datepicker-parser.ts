import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomNgbDatepickerParser extends NgbDateParserFormatter {

    parse(value: string): NgbDateStruct | null {
        if (!value) {
            return null;
        }

        const parts = value.split('.');
        if (parts.length !== 3) {
            return null;
        }

        return {
            day: Number(parts[1]),
            month: Number(parts[0]),
            year: Number(parts[2])
        };
    }

    format(date: NgbDateStruct | null): string {
        if (!date) {
            return '';
        }

        return (
            this.pad(date.month) + '.' +
            this.pad(date.day) + '.' +
            date.year
        );
    }

    private pad(n: number): string {
        return n < 10 ? '0' + n : n.toString();
    }
}
