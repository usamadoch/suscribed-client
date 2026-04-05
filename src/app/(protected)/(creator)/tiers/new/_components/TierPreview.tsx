import Icon from '@/components/Icon';

interface TierPreviewProps {
    name: string;
    price: number;
    description: string;
    benefits: string[];
}

export default function TierPreview({ name, price, description, benefits }: TierPreviewProps) {
    return (
        <div className="w-80 xl:w-96 shrink-0">
            <div className="sticky top-24">
                <h5 className="text-h6 font-bold mb-4 text-gray-900 dark:text-white">Preview</h5>
                <div className="card flex flex-col relative">
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2 gap-4">
                            <h3 className="text-h5">{name || 'Tier Name'}</h3>
                        </div>
                        <div className="mb-4">
                            <span className="text-h2">PKR {Number.isNaN(price) ? 0 : price}</span>
                            <span className="text-n-3 dark:text-n-4 lg:font-bold">/mo</span>
                        </div>

                        <button className='btn-purple btn-medium w-full'>
                            Subscribe
                        </button>

                        <p className="text-sm text-n-3 dark:text-n-4 my-4 flex-1 whitespace-pre-wrap">
                            {description || 'Describe what this tier includes...'}
                        </p>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wide mb-4">What you get</h4>
                            <ul className="space-y-2">
                                {benefits.length > 0 ? (
                                    benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-n-1 dark:text-white">
                                            <Icon name="task" className="shrink-0 mt-0.5" />
                                            <span className="flex-1">{benefit}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-n-3 dark:text-n-4 italic">No specific benefits listed.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
