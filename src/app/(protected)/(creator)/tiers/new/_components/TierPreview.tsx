import { Icon } from '@/components/ui/icon';
import { Check, Star } from '@/lib/icons';


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
                <h5 className="text-h6 font-bold mb-4 text-n-1 dark:text-n-9">Preview</h5>
                <div className="card flex flex-col relative">
                    <div className="py-6 px-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2 gap-4">
                            <h3 className="text-h5 text-n-1 dark:text-n-9">{name || 'Tier Name'}</h3>
                        </div>
                        <div className="mb-3">
                            <span className="text-h2 text-n-1 dark:text-n-7">PKR {Number.isNaN(price) ? 0 : price}</span>
                            <span className="text-n-3 dark:text-n-4 lg:font-bold">/mo</span>
                        </div>

                        <button className='btn-purple btn-medium btn-shadow rounded-sm w-full'>
                            Subscribe
                        </button>

                        <p className="text-sm text-n-3 dark:text-n-9 my-3 flex-1 whitespace-pre-wrap">
                            {description || 'Describe what this tier includes...'}
                        </p>

                        <div>
                            {/* <h4 className="text-xs font-bold uppercase tracking-wide mb-4 text-n-1 dark:text-n-9">What you get</h4> */}
                            <ul className="space-y-2">
                                {benefits.length > 0 ? (
                                    benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-n-1 dark:text-n-8">
                                            <Icon icon={Check} size={18} className="shrink-0 mt-0.5 text-purple-1" />
                                            <span className="flex-1">{benefit}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex flex-col items-center justify-center p-6 mt-2 text-center border-2 border-dashed dark:border-n-6 rounded-lg">
                                        <Icon icon={Star} className="text-n-3 dark:text-n-6 mb-2" size={24} />
                                        <span className="text-sm text-n-4 dark:text-n-8 font-medium">No perks added yet</span>
                                        <span className="text-xs text-n-3 dark:text-n-7 mt-1">Add benefits to make this tier more attractive</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
