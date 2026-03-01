import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '@/components/Icon';

interface SortableItemProps {
    id: string;
    value: string;
    onRemove: () => void;
    onEdit: () => void;
    isOverlay?: boolean;
}

export default function SortableItem({ id, value, onRemove, onEdit, isOverlay = false }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging && !isOverlay ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex gap-3 items-center group bg-white dark:bg-n-1 p-2 border border-n-1 transition-colors ${isOverlay ? 'border-purple-1 ring-1 ring-purple-1/20 shadow-xl cursor-grabbing' : ''
                }`}
        >
            <div
                {...attributes}
                {...listeners}
                className={`px-1 text-n-1 transition-opacity outline-none ${isOverlay ? 'opacity-100 cursor-grabbing' : 'opacity-50 hover:opacity-100 cursor-grab active:cursor-grabbing'}`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>
            <div className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                {value || 'Empty perk'}
            </div>

            <button
                type="button"
                onClick={onEdit}
                title="Edit"
                className="w-8 h-8 bg-purple-1 border border-n-1 text-0 transition-colors hover:bg-purple-2">
                <Icon name="edit" viewBox='0 0 24 24' />
            </button>

            <button
                onClick={onRemove}
                type="button"
                title="Remove"
                className="w-8 h-8 bg-purple-1 border border-n-1 text-0 transition-colors hover:bg-purple-2">
                <Icon name="remove" />
            </button>
        </div>
    );
}
