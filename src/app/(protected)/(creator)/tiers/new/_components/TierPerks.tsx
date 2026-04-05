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

import { TierFormData } from '../../schema';
import SortableItem from './SortableItem';
import { predefinedPerks } from './constants';
import PerkModal from '@/components/modals/PerkModal';


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

            <PerkModal
                visible={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingIndex(null);
                }}
                editingIndex={editingIndex}
                isCustomPerk={isCustomPerk}
                setIsCustomPerk={setIsCustomPerk}
                selectedPerk={selectedPerk}
                setSelectedPerk={setSelectedPerk}
                customPerkText={customPerkText}
                setCustomPerkText={setCustomPerkText}
                predefinedPerks={predefinedPerks}
                onSave={(perkTitle) => {
                    if (editingIndex !== null) {
                        update(editingIndex, { ...perkFields[editingIndex], value: perkTitle } as any);
                    } else {
                        append({ value: perkTitle });
                    }
                    setSelectedPerk(null);
                    setCustomPerkText('');
                    setIsModalOpen(false);
                    setEditingIndex(null);
                }}
            />
        </>
    );
}
