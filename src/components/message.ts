import { ActionBuilderComponents, ActionRow, Button, Container, ContainerBuilderComponents, FixedComponents, Section, Separator, TextDisplay, Thumbnail } from 'seyfert';
import { EmojiResolvable } from 'seyfert/lib/common/index.js';
import { APIMessageComponentEmoji, ButtonStyle, Spacing } from 'seyfert/lib/types/index.js';

export function createTextDisplay(content: string): TextDisplay {
    return new TextDisplay({ content });
};

type SectionAccessory = ({
    url?: string;
    type: 'button';
    label?: string;
    skuId?: string;
    customId?: string;
    style: ButtonStyle;
    disabled?: boolean;
}) | ({
    url: string;
    type: 'thumbnail';
    spoiler?: boolean;
    description?: string;
})

export function createTextSection(content: string, accessory: SectionAccessory): Section {
    const section = new Section().addComponents(new TextDisplay({ content }));

    switch (accessory.type) {
        case 'button': section.setAccessory(new Button({
            url: accessory.url,
            label: accessory.label,
            style: accessory.style,
            sku_id: accessory.skuId,
            disabled: accessory.disabled,
            custom_id: accessory.customId
        })); break;

        case 'thumbnail': section.setAccessory(new Thumbnail({
            spoiler: accessory.spoiler,
            media: { url: accessory.url },
            description: accessory.description
        })); break;
    };

    return section;
};

export function createSeparator(spacing?: Spacing, divider?: boolean) {
    return new Separator({ spacing, divider });
};

interface ContainerOptions {
    color?: number | string;
    spoiler?: boolean;
}

export function createContainer(components: ContainerBuilderComponents[], options?: ContainerOptions): Container {
    const container = new Container({ spoiler: options?.spoiler }).setComponents(components);

    if (options?.color) {
        let color: number | undefined;
        if (typeof options.color === 'number') color = options.color;
        if (typeof options.color === 'string') color = parseInt(options.color.toString().replace('#', '0x'));
        container.setColor(color!);
    };

    return container;
};


export function createActionRow<T extends ActionBuilderComponents>(...components: FixedComponents<T>[]): ActionRow<T> {
    return new ActionRow<T>().setComponents(components);
};

interface BaseButtonData {
    label?: string;
    disabled?: boolean;
    emoji?: EmojiResolvable;
}

type ButtonData = (BaseButtonData & {
    url: string;
    style: ButtonStyle.Link;
}) | (BaseButtonData & {
    skuId: string;
    style: ButtonStyle.Premium;
}) | (BaseButtonData & {
    customId: string;
    style: ButtonStyle;
})

export function createButton(data: ButtonData): Button {
    const button = new Button({
        label: data.label,
        style: data.style,
        disabled: data.disabled
    });

    if (data.emoji) button.setEmoji(data.emoji);
    if ('skuId' in data) button.setSKUId(data.skuId);
    if ('customId' in data) button.setCustomId(data.customId);

    return button;
};
