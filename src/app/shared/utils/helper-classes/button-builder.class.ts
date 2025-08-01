import { ButtonAction } from "../../enums/buttonAction";

class ButtonActions {
    private actions: ButtonAction[] = [];

    public addAction(action: ButtonAction): void {
        this.actions.push(action);
    }

    public getActions(): ButtonAction[] {
        return this.actions;
    }
}

export class ButtonActionsBuilder {
    private buttonActions: ButtonActions = new ButtonActions();

    public addActionIf(predicate: () => boolean, action: ButtonAction): this {
        if (predicate()) {
            this.buttonActions.addAction(action);
        }
        return this;
    }

    public build(): ButtonActions {
        return this.buttonActions;
    }
}
