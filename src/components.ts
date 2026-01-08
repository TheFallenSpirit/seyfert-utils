import { Button, Container, ContainerBuilderComponents, Section, Separator, TextDisplay, Thumbnail } from 'seyfert';
import { ButtonStyle, Spacing } from 'seyfert/lib/types/index.js';

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
