import { ModalSubmitInteraction, ModalContext, InteractionCommandType, ModalCommand, ComponentCommand, ComponentInteraction, ComponentContext } from 'seyfert';

/* My custom modal handler to support advanced custom IDs. */
export async function handleModal(interaction: ModalSubmitInteraction) {
    const context = new ModalContext(interaction.client, interaction);
    const extended = interaction.client.options.context?.(interaction) ?? {};
    Object.assign(context, extended);

    const modal = interaction.client.components.commands.find((component) => (
        component.type === InteractionCommandType.MODAL &&
        component.customId === interaction.customId.split(':')[0]
    )) as ModalCommand;

    try {
        context.command = modal;
        await interaction.client.components.execute(modal, context);
    } catch (error) {
        interaction.client.components.onFail(error);
    };
};

/* My custom message component handler to support advanced custom IDs. */
export async function handleMessageComponent(interaction: ComponentInteraction) {
    // @ts-expect-error
    const context = new ComponentContext(interaction.client, interaction);
    const extended = interaction.client.options.context?.(interaction) ?? {};
    Object.assign(context, extended);

    const component = interaction.client.components.commands.find((component) => (
        component.type === InteractionCommandType.COMPONENT &&
        component.cType === interaction.componentType &&
        component.customId === interaction.customId.split(':')[0]
    )) as ComponentCommand;

    try {
        context.command = component;
        await interaction.client.components.execute(component, context);
    } catch (error) {
        await interaction.client.components.onFail(error);
    };
};
