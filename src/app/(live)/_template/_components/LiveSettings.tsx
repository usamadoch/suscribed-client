"use client";

import { Radio, RadioGroup } from "@headlessui/react";
import Switch from "@/components/Switch";

const accessPlans = [
    {
        id: "public",
        label: "Everyone",
        description: "Public — anyone with the link",
    },
    {
        id: "members",
        label: "Members only",
        description: "Paid members of any tier",
    },
];

type LiveSettingsProps = {
    formState: any; // We can use 'any' or import the ReturnType of useLiveRoomForm. Using any for simplicity here to match context approach quickly without cyclic dependencies
};

export default function LiveSettings({ formState }: LiveSettingsProps) {
    const {
        accessType, setAccessType,
        paidMessagesEnabled, setPaidMessagesEnabled,
        mergeYouTubeChat, setMergeYouTubeChat,
        notifyEmailOnLive, setNotifyEmailOnLive,
        notifyPushOnLive, setNotifyPushOnLive,
    } = formState;

    return (
        <>
            <div className="pb-4 px-5 border-b border-n-4 dark:border-n-6 shrink-0">
                <h5 className="text-h5" >Settings</h5>
            </div>

            {/* Section 3: Who can access this room? */}
            <div className="my-5 px-5">
                <div className="mb-3 text-xs font-semibold dark:text-n-8">Who can access this room?</div>
                <RadioGroup
                    value={accessPlans.find((p) => p.id === accessType) || accessPlans[0]}
                    onChange={(plan) => setAccessType(plan.id as "public" | "members")}
                    className="flex flex-col"
                >
                    {accessPlans.map((plan) => (
                        <Radio
                            key={plan.id}
                            value={plan}
                            className={({ checked }) =>
                                `group border border-n-1 p-4 dark:border-n-6 relative flex items-start mb-3 last:mb-0 cursor-pointer select-none transition-colors ${checked ? "bg-purple-1" : "bg-transparent"
                                }`
                            }
                        >
                            {({ checked }) => (
                                <>
                                    <div
                                        className={`flex justify-center items-center w-5 h-5 mt-0.5 mr-3 rounded-full border transition-colors ${checked
                                            ? "border-n-1"
                                            : "bg-transparent border-n-3 dark:border-n-6"
                                            }`}
                                    >
                                        {checked && <div className="w-2 h-2 rounded-full bg-n-1" />}
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`text-sm font-bold transition-colors ${checked ? "text-n-1" : "text-n-3 dark:text-n-7"
                                                }`}
                                        >
                                            {plan.label}
                                        </div>
                                        <div
                                            className={`text-xs transition-colors ${checked ? "text-n-1" : "text-n-3 dark:text-white/50"
                                                }`}
                                        >
                                            {plan.description}
                                        </div>
                                    </div>
                                </>
                            )}
                        </Radio>
                    ))}
                </RadioGroup>
            </div>

            {/* Section 4: Paid messages */}
            <div className="mt-5 pt-5 px-5 border-t border-dashed border-n-1 dark:border-n-6">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-bold dark:text-n-9">Enable paid messages</div>
                    <Switch value={paidMessagesEnabled} setValue={setPaidMessagesEnabled} />
                </div>
            </div>

            {/* Section 5: Notifications */}
            <div className="mt-5 pt-5 px-5 border-t border-dashed border-n-1 dark:border-n-6">
                <div className="mb-4 text-xs font-semibold dark:text-n-8">Notifications</div>

                <div className="flex justify-between items-start mb-4">
                    <div className="mr-4">
                        <div className="text-sm font-bold dark:text-n-9">Email members</div>
                        <div className="text-xs text-n-3 dark:text-n-8 font-medium">When you go live</div>
                    </div>
                    <Switch value={notifyEmailOnLive} setValue={setNotifyEmailOnLive} />
                </div>

                <div className="flex justify-between items-center">
                    <div className="mr-4">
                        <div className="text-sm font-bold dark:text-n-9">In-app push</div>
                    </div>
                    <Switch value={notifyPushOnLive} setValue={setNotifyPushOnLive} />
                </div>
            </div>

            {/* Section 6: Chat & moderation */}
            <div className="mt-5 pt-5 px-5 border-t border-dashed border-n-1 dark:border-n-6">
                <div className="mb-4 text-xs font-semibold dark:text-n-8">Chat & moderation</div>

                <div className="flex justify-between items-center mb-4">
                    <div className="mr-4">
                        <div className="text-sm font-bold dark:text-n-9">Merge YouTube chat</div>
                    </div>
                    <Switch value={mergeYouTubeChat} setValue={setMergeYouTubeChat} />
                </div>

            </div>
        </>
    );
}
