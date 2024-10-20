/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import {
  type AbstractControl,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import { UserService } from "../Services/user.service";
import { Component } from "@angular/core";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FormSubmitService } from "../Services/form-submit.service";
import { TranslateService } from "@ngx-translate/core";

library.add(faSave, faEdit);

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent {
  public passwordControl: UntypedFormControl = new UntypedFormControl("", [
    Validators.required,
  ]);
  public newPasswordControl: UntypedFormControl = new UntypedFormControl("", [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(40),
  ]);
  public repeatNewPasswordControl: UntypedFormControl = new UntypedFormControl(
    "",
    [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(40),
      matchValidator(this.newPasswordControl),
    ]
  );
  public error: any;
  public confirmation: any;

  constructor(
    private readonly userService: UserService,
    private readonly formSubmitService: FormSubmitService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.formSubmitService.attachEnterKeyHandler(
      "password-form",
      "changeButton",
      () => {
        this.changePassword();
      }
    );
  }

  changePassword() {
    if (
      localStorage.getItem("email")?.match(/support@.*/) &&
      !this.newPasswordControl.value.match(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,30}/
      )
    ) {
      this.error =
        "The password does not meet corporate policy requirements for privileged accounts.";
    }
    this.userService
      .changePassword({
        current: this.passwordControl.value,
        new: this.newPasswordControl.value,
        repeat: this.repeatNewPasswordControl.value,
      })
      .subscribe(
        (response: any) => {
          this.error = undefined;
          this.translate.get("PASSWORD_SUCCESSFULLY_CHANGED").subscribe(
            (passwordSuccessfullyChanged) => {
              this.confirmation = `Password successfully changed!`;
            },
            (translationId) => {
              this.confirmation = `Password successfully changed.`;
            }
          );
          this.resetForm();
        },
        (error) => {
          this.error = `Failed to change password. Please try again.`;
          this.confirmation = undefined;
          this.resetPasswords();
        }
      );
  }

  resetForm() {
    this.passwordControl.setValue("");
    this.resetPasswords();
  }

  resetPasswords() {
    this.passwordControl.markAsPristine();
    this.passwordControl.markAsUntouched();
    this.newPasswordControl.setValue("");
    this.newPasswordControl.markAsPristine();
    this.newPasswordControl.markAsUntouched();
    this.repeatNewPasswordControl.setValue("");
    this.repeatNewPasswordControl.markAsPristine();
    this.repeatNewPasswordControl.markAsUntouched();
  }
}

function matchValidator(newPasswordControl: AbstractControl) {
  return function matchOtherValidate(
    repeatNewPasswordControl: UntypedFormControl
  ) {
    const password = newPasswordControl.value;
    const passwordRepeat = repeatNewPasswordControl.value;
    if (password !== passwordRepeat) {
      return { notSame: true };
    }
    return null;
  };
}
