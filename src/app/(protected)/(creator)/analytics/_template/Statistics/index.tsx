import Select from "@/components/Select";
import Icon from "@/components/Icon";
import { TimeRangeOption } from "../types";

export type StatisticsItem = {
    id: string;
    title: string;
    value: string;
    percent: number;
    color: string;
    parameters: number[];
};

type StatisticsProps = {
    items: StatisticsItem[];
    timeRangeValue?: TimeRangeOption;
    onTimeRangeChange?: (value: TimeRangeOption) => void;
    timeRangeOptions?: TimeRangeOption[];
};

const Statistics = ({ items, timeRangeValue, onTimeRangeChange, timeRangeOptions }: StatisticsProps) => (
    <>
        <div className="flex mt-5 justify-between items-center mb-3.5">
            <div className="text-h6"></div>
            {timeRangeValue && onTimeRangeChange && timeRangeOptions && (
                <Select
                    className="self-start min-w-36"
                    items={timeRangeOptions}
                    value={timeRangeValue}
                    onChange={onTimeRangeChange}
                    small
                />
            )}
        </div>
        <div className="flex -mx-2.5 md:block md:mx-0">
            {items.map((item) => (
                <div
                    className="flex w-[calc(33.333%-1.25rem)] mx-2.5 pl-5 pr-7 py-4 card lg:px-4 md:w-full md:px-5 md:mx-0 md:mb-4 md:last:mb-0"
                    key={item.id}
                >
                    <div className="mr-auto">
                        <div className="mb-1.5 text-sm">{item.title}</div>
                        <div className="mb-1.5 text-h4 lg:text-h5 md:text-h4">
                            {item.value}
                        </div>
                        <div
                            className={`flex items-center text-xs font-bold ${item.percent > 0
                                ? "text-green-1 fill-green-1"
                                : item.percent < 0 ? "text-red-300 fill-red-300" : "text-n-4 fill-n-4"
                                }`}
                        >
                            {item.percent !== 0 && (
                                <Icon
                                    className="mr-1 fill-inherit"
                                    name={
                                        item.percent > 0
                                            ? "arrow-up-right"
                                            : "arrow-down-right"
                                    }
                                />
                            )}
                            {item.percent > 0 ? "+" : ""}{item.percent}%
                        </div>
                    </div>

                    {/* <div className="flex space-x-3 lg:space-x-2 md:space-x-3">
                        {item.parameters.map((parameter, index) => (
                            <div
                                className="relative w-1 h-[4.82rem] rounded-1"
                                style={{ backgroundColor: item.color }}
                                key={index}
                            >
                                <div
                                    className="absolute left-0 right-0 bottom-0 rounded-sm"
                                    style={{
                                        height: `${parameter}%`,
                                        backgroundColor: item.color
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div> */}
                </div>
            ))}
        </div>
    </>
);

export default Statistics;
