"use client";

import { useState } from 'react';
import { useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Select from '@/components/Select';
import Modal from '@/components/Modal';
import { TierFormData } from '../../schema';
import Field from '@/components/Field';
import SortableItem from './SortableItem';
import { predefinedPerks } from './constants';


interface TierPerksProps {
    control: Control<TierFormData>;
    register: UseFormRegister<TierFormData>;
}

export default function TierPerks({ control, register }: TierPerksProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerk, setSelectedPerk] = useState<{ id: string, title: string } | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isCustomPerk, setIsCustomPerk] = useState(false);
    const [customPerkText, setCustomPerkText] = useState('');

    const { fields: perkFields, append, remove, move, update } = useFieldArray({
        control,
        name: "benefits"
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (over && active.id !== over.id) {
            const oldIndex = perkFields.findIndex((f) => f.id === active.id);
            const newIndex = perkFields.findIndex((f) => f.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-900 dark:text-white mb-2">
                    Tier perks (optional)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Let your members know what they can expect from this membership tier
                </p>
                <div className="space-y-3">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={perkFields.map(f => f.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {perkFields.map((field, index) => (
                                    <div key={field.id} className="relative">
                                        <input type="hidden" {...register(`benefits.${index}.value` as const)} value={field.value} />
                                        <SortableItem
                                            id={field.id}
                                            value={field.value}
                                            onRemove={() => remove(index)}
                                            onEdit={() => {
                                                setEditingIndex(index);
                                                const text = field.value;
                                                const existing = predefinedPerks.find(p => p.title === text);
                                                if (existing) {
                                                    setSelectedPerk(existing);
                                                    setIsCustomPerk(false);
                                                } else {
                                                    setCustomPerkText(text);
                                                    setIsCustomPerk(true);
                                                    setSelectedPerk(null);
                                                }
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                        <DragOverlay>
                            {activeId ? (
                                <SortableItem
                                    id={activeId}
                                    value={perkFields.find(f => f.id === activeId)?.value || ''}
                                    onRemove={() => { }}
                                    onEdit={() => { }}
                                    isOverlay
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditingIndex(null);
                        setSelectedPerk(null);
                        setCustomPerkText('');
                        setIsCustomPerk(false);
                        setIsModalOpen(true);
                    }}
                    className="text-sm text-purple-1 font-medium hover:text-purple-2 transition-colors flex items-center gap-1 mt-3"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add perk
                </button>
            </div>

            <Modal
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingIndex !== null ? "Edit Perk" : "Add Perk"}
            >
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-gray-900 dark:text-white">
                                {isCustomPerk ? "Custom Perk" : "Select a Perk"}
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomPerk(!isCustomPerk);
                                    setSelectedPerk(null);
                                    setCustomPerkText('');
                                }}
                                className="text-xs text-purple-1 hover:text-purple-2 font-medium"
                            >
                                {isCustomPerk ? "Select predefined perk instead" : "Create custom perk"}
                            </button>
                        </div>
                        {isCustomPerk ? (
                            <Field
                                value={customPerkText}
                                classInput="h-12"
                                onChange={(e: any) => setCustomPerkText(e.target.value)}
                            // placeholder="Enter your custom perk..."
                            />
                        ) : (
                            <Select
                                items={predefinedPerks}
                                value={selectedPerk}
                                classButton="h-12"
                                onChange={setSelectedPerk}
                                placeholder="Choose a perk..."
                                classOptions="max-h-[250px] overflow-y-auto custom-scrollbar"
                            />
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn-stroke btn-medium min-w-[100px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled={!selectedPerk && (!isCustomPerk || !customPerkText.trim())}
                            onClick={() => {
                                const finalPerkTitle = isCustomPerk ? customPerkText.trim() : selectedPerk?.title;
                                if (finalPerkTitle) {
                                    if (editingIndex !== null) {
                                        update(editingIndex, { ...perkFields[editingIndex], value: finalPerkTitle } as any);
                                    } else {
                                        append({ value: finalPerkTitle });
                                    }
                                    setSelectedPerk(null);
                                    setCustomPerkText('');
                                    setIsModalOpen(false);
                                    setEditingIndex(null);
                                }
                            }}
                            className="btn-purple btn-medium min-w-[100px] disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {editingIndex !== null ? "Save" : "Add"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
