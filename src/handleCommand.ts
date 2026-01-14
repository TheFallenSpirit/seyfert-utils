import { ModalSubmitInteraction, ModalContext, InteractionCommandType, ModalCommand, ComponentCommand, ComponentInteraction } from 'seyfert';
import { HandleCommand } from 'seyfert/lib/commands/handle.js';

/* My custom modal handler to support advanced custom IDs. */
export async function handleModal(this: HandleCommand, interaction: ModalSubmitInteraction) {
    const context = new ModalContext(this.client, interaction);
    const extended = this.client.options.context?.(interaction) ?? {};
    Object.assign(context, extended);

    const modal = this.client.components.commands.find((component) => (
        component.type === InteractionCommandType.MODAL &&
        component.customId === interaction.customId.split(':')[0]
    )) as ModalCommand;

    try {
        context.command = modal;
        await this.client.components.execute(modal, context);
    } catch (error) {
        this.client.components.onFail(error);
    };
};

/* My custom message component handler to support advanced custom IDs. */
export async function handleMessageComponent(this: HandleCommand, interaction: ComponentInteraction) {
    // @ts-expect-error
    const context = new ComponentContext(this.client, interaction);
    const extended = this.client.options.context?.(interaction) ?? {};
    Object.assign(context, extended);

    const component = this.client.components.commands.find((component) => (
        component.type === InteractionCommandType.COMPONENT &&
        component.cType === interaction.componentType &&
        component.customId === interaction.customId.split(':')[0]
    )) as ComponentCommand;

    try {
        context.command = component;
        await this.client.components.execute(component, context);
    } catch (error) {
        await this.client.components.onFail(error);
    };
};
