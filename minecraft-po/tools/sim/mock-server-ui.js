class F { constructor() { this.parts = []; } title() { return this; } body() { return this; } button() { return this; } textField() { return this; } dropdown() { return this; } slider() { return this; } toggle() { return this; } submitButton() { return this; } async show() { return { canceled: true }; } }
export class ActionFormData extends F {}
export class ModalFormData extends F {}
export class MessageFormData extends F {}
export const FormCancelationReason = { UserBusy: "UserBusy", UserClosed: "UserClosed" };
