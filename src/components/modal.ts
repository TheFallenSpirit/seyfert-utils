import { Label, Modal, StringSelectMenu, TextInput, FileUpload, RadioGroup, CheckboxGroup } from 'seyfert';
import { TextInputStyle, APISelectMenuOption } from 'seyfert/lib/types/index.js';
import { truncateString } from '../utilities.js';

interface ModalData {
    title: string;
    customId: string;
    components: Label[];
}

export function createModal(data: ModalData) {
    return new Modal({
        title: truncateString(data.title, 45),
        custom_id: data.customId
    }).setComponents(data.components);
};

interface TextInputData {
    label?: string;
    value?: string;
    customId: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    description?: string;
    placeholder?: string;
    style: TextInputStyle;
};

export function createTextInput(data: TextInputData) {
    return new Label({
        label: data.label,
        description: data.description
    }).setComponent(new TextInput({
        value: data.value,
        style: data.style,
        required: data.required,
        custom_id: data.customId,
        min_length: data.minLength,
        max_length: data.maxLength,
        placeholder: data.placeholder
    }));
};

interface StringSelectMenuData {
    label?: string;
    customId: string;
    required?: boolean;
    minValues?: number;
    maxValues?: number;
    description?: string;
    placeholder?: string;
    options: APISelectMenuOption[];
}

export function createStringSelectMenu(data: StringSelectMenuData) {
    return new Label({
        label: data.label,
        description: data.description,
    }).setComponent(new StringSelectMenu({
        options: data.options,
        required: data.required,
        custom_id: data.customId,
        min_values: data.minValues,
        max_values: data.maxValues,
        placeholder: data.placeholder
    }));
};

interface FileUploadData {
    label?: string;
    customId: string;
    required?: boolean;
    minValues?: number;
    maxValues?: number;
    description?: string;
}

export function createFileUpload(data: FileUploadData) {
    return new Label({
        label: data.label,
        description: data.description
    }).setComponent(new FileUpload({
        required: data.required,
        custom_id: data.customId,
        min_values: data.minValues,
        max_values: data.maxValues
    }));
};

interface GroupOption {
    value: string;
    label: string;
    default?: boolean;
    description?: string;
}

interface RadioGroupData {
    label?: string;
    customId: string;
    required?: boolean;
    description?: string;
    options: GroupOption[];
}

export function createRadioGroup(data: RadioGroupData) {
    return new Label({
        label: data.label,
        description: data.description
    }).setComponent(new RadioGroup({
        options: data.options,
        required: data.required,
        custom_id: data.customId
    }));
};

interface CheckboxGroupData {
    label?: string;
    customId: string;
    required?: boolean;
    minValues?: number;
    maxValues?: number;
    description?: string;
    options: GroupOption[];
}

export function createCheckboxGroup(data: CheckboxGroupData) {
    return new Label({
        label: data.label,
        description: data.description
    }).setComponent(new CheckboxGroup({
        options: data.options,
        required: data.required,
        custom_id: data.customId,
        min_values: data.minValues,
        max_values: data.maxValues
    }))
};
