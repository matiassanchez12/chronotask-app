import Image from "next/image";

export default function Logo() {
    return <>
        <Image
            src="/logos.svg"
            alt="ChonoTask"
            width={32}
            height={32}
            className="object-contain"
        />
        <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-slate-400">
            Chrono<span className="font-medium text-slate-500 dark:text-slate-100">Task</span>
        </span>
    </>;
};