import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

/**
 * Method that checks validity of email
 * @returns 
 */
export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const val = control.value;
        if (val && !val.match("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")) {
            return { email: true }
        }
    };
}

/**
 * Method that validates whether entered date and time is greater than current time or not
 * @param dateFormControlName 
 * @param timeFormControlName 
 * @returns 
 */
export function dateAndTimeValidator(dateFormControlName: string, timeFormControlName: string): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
        const currentDate = new Date();
        let date = group['controls'][dateFormControlName]['value'];
        let time = group['controls'][timeFormControlName]['value'];
        if (date && time) {
            date = moment(date).format('YYYY-MM-DD');
            time = moment(time, 'h:mm A').format('HH:mm:ss');
            const endDate = new Date(`${date} ${time}`);

            if (currentDate > endDate) {
                group['controls'][timeFormControlName].setErrors({ dateTime: true });
            } else {
                group['controls'][timeFormControlName].setErrors(null);
            }
            return;
        }
    };
}

/**
 * Method that valiates the date where ngModel is used
 * @param startDate 
 * @param endDate 
 * @returns 
 */
export function validateDate(startDate: string | Date, endDate: string | Date) {
    let errorMsg: string;
    if ((startDate && !endDate) || (!startDate && endDate)) {
        errorMsg = 'Please enter both the start and end dates'
    }
    else if (startDate > endDate) {
        errorMsg = 'Please choose a valid date range'
    }
    return errorMsg;
}

/**
 * Method that validates the email where ngModel is used
 * @param email 
 * @returns 
 */
export function validateEmail(email: string) {
    if (email && !email.match("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")) {
        return 'Please enter valid email address'
    }
}

/**
 * Method that validates the phone where ngModel is used
 * @param phone 
 * @returns 
 */
export function validatePhone(phone: string) {
    const expr = /^(0|91)?[6-9][0-9]{9}$/;
    if (phone && !phone.match("^[6-9][0-9]{9}$")) {
        return 'Please enter valid phone number'
    }
}