import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
    static match(controlName: string, matchingControlName: string): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);
    
            if(!control || !matchingControl) {
                console.error("FormControl cannot be found");
                return { controlNotFound: false };
            }
            
            const error = control.value === matchingControl.value ? null : { noMatch: true };

            matchingControl.setErrors(error)
            return error;
        }
    }
}
